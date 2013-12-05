define([
    'angular',
    'common/directives/loading',
    'common/directives/strip',
    'common/services/sharing',
    'common/services/dev',
    'common/services/viewport',
    'common/directives/autofocus',
    'common/services/key',
    'common/services/alert',
    'common/directives/alert',
    'common/services/keeper',
    'common/services/ga',
    'common/services/notification',
    'common/directives/notification',
    'common/services/browser',
    'common/bootstrap',
    'common/directives/blank',
    'common/directives/upgrade-warning',
    'common/services/title-notification',
    'common/directives/navbar',
    'common/services/emitter',
    'common/services/socket',
    'common/services/share',
    'common/directives/auto-stretch-textarea',
    'common/directives/temporary-disabled',
    'common/directives/disconnect-panel',
    'common/directives/sidebar',
    'common/services/db',
    'common/directives/nav-item',
    'common/services/desktop-notification',
    'common/services/window-focus',
    'common/directives/scroll-detect',
    'common/services/communicate-snappea-com'
], function(
    angular,
    loading,
    strip,
    sharing,
    dev,
    viewport,
    autofocus,
    key,
    alert,
    alertDirecitve,
    keeper,
    ga,
    notification,
    notificationDirective,
    browser,
    bootstrap,
    blankDirective,
    upgradeWarningDirective,
    titleNotification,
    navbar,
    emitter,
    socket,
    share,
    autoStretchTextarea,
    temporaryDisabled,
    disconnectPanel,
    sidebar,
    db,
    navItem,
    desktopNotification,
    windowFocus,
    scrollDetect,
    communicateSnappeaCom
) {
// jshint unused:false
'use strict';
// Common Module is the collection of most used or global functions.
angular.module('wdCommon', ['wdBootstrap', 'ui', 'monospaced.elastic'])
    // Directives
    .directive('wdAutoFocus', autofocus)
    .directive('wdAutoStretchTextarea', autoStretchTextarea)
    .directive('wdNavbar', navbar)
    .directive('wdNavItem', navItem)
    .directive('wdStrip', strip)
    .directive('wdLoading', loading)
    .directive('wdAlert', alertDirecitve)
    .directive('wdNotification', notificationDirective)
    .directive('wdBlank', blankDirective)
    .directive('wdUpgradeWarning', upgradeWarningDirective)
    .directive('wdTemporaryDisabled', temporaryDisabled)
    .directive('disconnectPanel', disconnectPanel)
    .directive('wdSidebar', sidebar)
    .directive('wdScrollDetect', scrollDetect)
    // Services
    .provider('wdDev', dev)
    .provider('wdEventEmitter', emitter)
    .factory('wdSocket', socket)
    .factory('wdBrowser', browser)
    .factory('wdViewport', viewport)
    .factory('wdShare', share)
    .factory('wdSharing', sharing)
    .factory('wdKey', key)
    .factory('wdAlert', alert)
    .factory('wdKeeper', keeper)
    .factory('GA', ga)
    .factory('wdNotification', notification)
    .factory('wdTitleNotification', titleNotification)
    .factory('wdDesktopNotification', desktopNotification)
    .factory('wdWindowFocus', windowFocus)
    .factory('wdDatabase', db)
    .factory('wdCommunicateSnappeaCom', communicateSnappeaCom);
});
