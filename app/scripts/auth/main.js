/*global Modernizr*/
define([
    'angular',
    'auth/services/device',
    'auth/services/googleSignIn',
    'auth/services/wandoujiaSignIn',
    'auth/controllers/internationalCtrl',
    'auth/controllers/cloudDataCtrl'
], function(
    angular,
    device,
    googleSignIn,
    wandoujiaSignIn,
    internationalCtrl,
    cloudDataCtrl
) {
'use strict';

angular.module('wdAuth', ['wdCommon'])
    .provider('wdDevice', device)
    .factory('wdGoogleSignIn', googleSignIn)
    .factory('wandoujiaSignIn', wandoujiaSignIn)
    .controller('internationalController', internationalCtrl)
    .controller('cloudDataController', cloudDataCtrl);
});
