define([
        'text!templates/common/sidebar.html'
    ], function(
        template
    ) {
'use strict';
return [function() {
    return {
        restrict: 'EAC',
        replace: true,
        template: template,
        scope: true,
        controller: [
                '$scope', 'wdDevice', 'wdGoogleSignIn', 'wdShare',
                'wdAlert', 'GA', '$rootScope', 'wdLanguageEnvironment',
                '$q', 'wdToast',  '$timeout', '$window',
        function($scope,   wdDevice,  wdGoogleSignIn,   wdShare,
                 wdAlert,  GA,    $rootScope,   wdLanguageEnvironment,
                 $q,   wdToast,   $timeout, $window) {
            $scope.isLoadingDevices = false;
            $scope.isChangeDevicesPopShow = false;
            $scope.account = '';

            function clearLayersStatus() {
                $scope.devicesAnimate = false;
                $scope.devicesDefault = false;
                $scope.devicesHide = false;
                $scope.currentDeviceLayer = false;

                $scope.settingsAnimate = false;
                $scope.settingsDefault = false;
                $scope.settingsHide = false;
                $scope.settingsHideImmediate = false;
                $scope.currentSettingsLayer = false;
            }

            clearLayersStatus();

            $scope.closeSidebar = function() {
                $rootScope.showSidebar = false;
            };

            $rootScope.$on('sidebar:open', function() {
                wdGoogleSignIn.getProfileInfo().then(function(data) {
                    $scope.profileInfo = data;
                });
            });

            $rootScope.$on('sidebar:close', function() {
                $scope.closeSidebar();
                stopLoopRefreshDevices();
            });

            $rootScope.$on('sidebar:devices:animate', function() {
                refreshDevices();
                loopRefreshDevices();
                clearLayersStatus();

                $scope.settingsHide = true;
                $scope.devicesAnimate = true;
                $scope.currentDeviceLayer = true;
            });

            $rootScope.$on('sidebar:devices:default', function() {
                $scope.deviceList = [];
                $scope.isLoadingDevices = true;
                refreshDevices();
                loopRefreshDevices();
                clearLayersStatus();
                $scope.settingsHideImmediate = true;
                $scope.devicesDefault = true;
                $scope.currentDeviceLayer = true;
            });

            $rootScope.$on('sidebar:settings:animate', function() {
                clearLayersStatus();
                stopLoopRefreshDevices();
                $scope.settingsAnimate = true;
                $scope.devicesHide = true;
                $scope.currentSettingsLayer = true;
            });

            $rootScope.$on('sidebar:settings:default', function() {
                clearLayersStatus();
                stopLoopRefreshDevices();
                $scope.settingsDefault = true;
                $scope.devicesHide = true;
            });

            $scope.addNewPhone = function () {
                $scope.isShowAddNewPhoneTips = !$scope.isShowAddNewPhoneTips;
            };

            $scope.changeDevice = function (item) {
                if(item.ip !== wdDevice.getDevice().ip){
                    wdDevice.signout();
                    wdDevice.setDevice(item);
                    $scope.deviceList = [];
                    $scope.isLoadingDevices = true;
                    refreshDevices();
                }
            };

            $scope.selectedLanguage = function(language) {
                return wdLanguageEnvironment.currentLanguageBelongsTo(language);
            };

            function refreshDevices() {
                $scope.deviceList = [];
                $timeout(function() {
                    $scope.isLoadingDevices = true;
                    (function getDevices() {
                        wdGoogleSignIn.getDevices().then(function(list){
                            $scope.isLoadingDevices = false;
                            $scope.deviceList = getListData(list);
                        },function(){
                            wdGoogleSignIn.checkToken().then(function(){
                                getDevices();
                            }, function() {
                                $scope.signout();
                            });
                        });
                    })();
                }, 300);
            }

            function loopRefreshDevices() {
                $scope.loopRefreshDevices = wdGoogleSignIn.loopGetDevices();
                $scope.$watch('loopRefreshDevices', function(newData, oldData) {
                    $scope.deviceList = getListData(newData);
                }, true);
            }

            function stopLoopRefreshDevices() {
                wdGoogleSignIn.stopLoopGetDevices();
            }

            function getListData(list) {
                var device = wdDevice.getDevice();
                var ip ;
                if (device) {
                    ip = device.ip;
                    for (var i = 0 , l = list.length ; i < l ; i += 1) {
                        if (ip === list[i].ip) {
                            list[i].selected = true;
                        } else {
                            list[i].selected = false;
                        }
                    }
                    return list;
                } else {
                    return [];
                }
            }

            $scope.signout = function() {
                var toastPromise = wdGoogleSignIn.signout().then(function() {
                    // $window.location.reload();
                }, function() {
                    return $q.reject($scope.$root.DICT.app.SIGN_OUT_ERROR_TOAST);
                });
                toastPromise.content = $scope.$root.DICT.app.SIGN_OUT_TOAST;
                wdToast.apply(toastPromise);
                $scope.closeSidebar();
            };

            //facebook
            $scope.isConnectedFacebook = function() {
                return wdShare.getIsConnectedFacebook();
            };

            wdShare.getFacebookLoginStatus();

            $scope.handleFacebookConnect = function() {
                if (wdShare.getIsConnectedFacebook()) {
                    wdAlert.confirm(
                        $scope.$root.DICT.app.DISCONNECT_FACEBOOK,
                        $scope.$root.DICT.app.DISCONNECT_FACEBOOK_INFO,
                        $scope.$root.DICT.app.DISCONNECT
                    ).then(function() {
                        wdShare.disconnectFacebook();
                    });

                    GA('navbar:facebook_logout');
                } else {
                    wdShare.connectFacebook();

                    GA('navbar:facebook_login');
                }
            };

            // 短信提醒声音设置
            if ($window.localStorage.getItem('messageSoundOpen') !== 'false') {
                $scope.messageSoundOpen = true;
            } else {
                $scope.messageSoundOpen = false;
            }

            $scope.setMessageSoundOpen = function() {
                if ($scope.messageSoundOpen) {
                    GA('navbar:sound_setting:Click_Unmute');
                    $window.localStorage.setItem('messageSoundOpen', false);
                } else {
                    GA('navbar:sound_setting:Click_Mute');
                    $window.localStorage.setItem('messageSoundOpen', true);
                }
                $scope.messageSoundOpen = !$scope.messageSoundOpen;
            };

        }]
    };
}];
});
