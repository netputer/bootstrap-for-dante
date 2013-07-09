define( [
    'underscore'
], function(
    _
) {
    'use strict';

//$q是promise
return [ '$http', '$q','$rootScope', function ( $http, $q, $rootScope ) {

    var global = {
        appsList:[],
        fun : undefined,
        newAppList : []
    };
    var result;

    function getAppListData() {
        console.log('abcde');
        return $http({
            method: 'get',
            // http://sync.wandoujia.com/resource/apps?cursor=0&length=10&order=DESC)
            url: '/resource/apps?length=9999'
        }).success(function(data) {
            global.appsList = [];
            for( var i = 0,l = data.length ; i<l; i+=1 ){
                global.appsList.push(result.changeInfo(data[i]));
            }
        }).error(function(){
        });
            // $.ajax({
            //     type: 'GET',
            //     url: url,
            //     async: false,
            //     contentType: 'application/json',
            //     dataType: 'jsonp',
            //     success: function( data ) {
            //         defer.resolve( data );
            //         $rootScope.$apply();
            //     },
            //     error: function(e) {
            //         $log.error('需要登陆豌豆荚');
            //         defer.reject();
            //         $rootScope.$apply();
            //     }
            // });
    }

    $rootScope.$on('signout', function() {
        global.appsList = [];
    });

    result = {
        getApplications : function(){
            return global.appsList ;
        },

        onchange : function(fun){
            global.fun = fun;
            if(global.appsList.length){
                global.fun.call(this,global.appsList);
            }else{
                getAppListData().success(function(){
                    global.fun.call(this,global.appsList);
                });
            }
        },

        setNewAppList : function(list){
            global.newAppList = list;
        },

        getNewAppList : function(){
            return global.newAppList;
        },

        //改变某些字段的值
        changeInfo : function(data){

            //将字节换算为兆
            data['apk_size'] = Number(data['apk_size']/1024/1024).toFixed(2);
            switch(data['installed_location']){
                case 1:
                    data['installed_location'] = "Phone memory";
                break;
                case 2:
                    data['installed_location'] = "SD card";
                break;
            };

            //是否显示提示
            data['confirmTipShow'] = false;

            //是否显示安装成功
            data['doneTipShow'] = false;

            data['checked'] = false;
            return data;
        }

    };

    return result;

}];
});
