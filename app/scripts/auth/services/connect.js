define([], function() {
'use strict';
return ['GA', 'wdDevice', '$q', '$http', 'wdDev', '$timeout',
function(GA,   wdDevice,   $q,   $http,   wdDev,   $timeout) {
    var TIME_SPAN = 3000;
    var wakeUpTimes;
    var connectDeviceTimes;
    function resetMaxWakeupTrytimes(times) {
        wakeUpTimes = times || 3;
    }
    resetMaxWakeupTrytimes();

    function resetMaxconnectTrytimes(times) {
        connectDeviceTimes = times || 3;
    }
    resetMaxconnectTrytimes();

    var api = {

        // 通过同一局域网连接
        connectDevice : function(deviceData) {

            GA('connect_device:enter_snappea:'+ deviceData.model);
            GA('check_sign_in:auth_all:all');
            
            // 远程唤醒一下设备
            wdDevice.lightDeviceScreen(deviceData.id);
            
            var defer = $q.defer();
            var authCode = deviceData.authcode;
            var ip = deviceData.ip;
            wdDev.setServer(ip);
            
            // 下面方法统计是否超时会用到
            var timeout = 10000;
            var timeStart = (new Date()).getTime();
            $http({
                method: 'get',
                url: '/directive/auth',
                timeout: timeout,
                params: {
                    authcode: authCode,
                    'client_time': (new Date()).getTime(),
                    'client_name': 'Browser',
                    'client_type': 3
                }
                // 自定义的，默认底层做错误控制，但是可以被调用方禁止，这样有些不合规则或遗留的api可以在应用层自己处理错误。
                // disableErrorControl: !$scope.autoAuth
            }).success(function(response) {
                GA('connect_device:connect:success');
                GA('check_sign_in:auth:sucess');
                wdDevice.setDevice(deviceData);
                wdDev.setMetaData(response);
                defer.resolve();
            }).error(function(reason, status, headers, config) {
                var action;
                var duration = Date.now() - timeStart;
                if (status === 0) {
                    action = (Math.round(duration / 1000) * 1000 < timeout) ? ('unreached:' + duration) : 'timeout';
                } else if (status === 401) {
                    action = 'reject:' + duration;
                } else {
                    action = 'unknown_' + status + ':' + duration;
                }
                GA('connect_device:connect:fail_' + action);
               
                // 统计失败原因（总）
                GA('check_sign_in:auth:fail_' + action);
                // 统计失败的设备及该设备失败原因
                GA('check_sign_in:auth_fall_model:fail_' + action + '_' + deviceData.model);
                // 统计失败的系统版本
                GA('check_sign_in:auth_fall_sdk:fail_' + action + '_' + deviceData.attributes.sdk_version);
                // 统计失败的 Rom 版本
                GA('check_sign_in:auth_fall_rom:fail_' + action + '_' + deviceData.attributes.rom);
                defer.reject();
            });
            return defer.promise;            
        },

        connectDeviceWithRetry: function(deviceData, times) {
            resetMaxconnectTrytimes(times);
            var defer = $q.defer();

            var tick = function() {
                var timestamp = new Date().getTime();
                connectDeviceTimes -= 1;
                api.connectDevice(deviceData).then(function() {
                    defer.resolve();
                }, function() {
                    if (connectDeviceTimes > 0) {
                        var nowTimestamp = new Date().getTime();
                        if ((wdDev.isRemoteConnection() || wdDev.getRequestWithRemote()) && (nowTimestamp - timestamp) < TIME_SPAN) {
                            $timeout(function() {
                                tick();
                            }, TIME_SPAN - nowTimestamp + timestamp);
                        } else {
                            tick();
                        }
                        
                    } else {
                        defer.reject();
                    }
                });
            };

            tick();
            return defer.promise;
        },

        remoteConnect: function(deviceData) {
            var defer = $q.defer();

            $http({
                method: 'get',
                url: wdDev.getWakeUpUrl() + '?did=' + deviceData.id,
                timeout: 4000,
            })
            .success(function(response) {
                response.wap = deviceData.ip ? false : true;
                response.networkType = deviceData.networkType;
                response.limitSize = 5 * 1024 * 1024;

                defer.resolve(response);
            })
            .error(function() {
                defer.reject();
            });

            return defer.promise;
        },

        remoteConnectWithRety: function(deviceData, times) {
            resetMaxWakeupTrytimes(times);
            var defer = $q.defer();

            var tick = function() {
                wakeUpTimes -= 1;
                api.remoteConnect(deviceData).then(function(data) {
                    defer.resolve(data);
                }, function(){
                    if (wakeUpTimes > 0) {
                        tick();
                    } else {
                        defer.reject();
                    } 
                });
            };
            tick();
            return defer.promise;
        }
    };

    return api;
}];
});
