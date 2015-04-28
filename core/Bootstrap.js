/*global define:true, require:true, $: true, navigator: true, cordova: true*/
/**
 * Execute steps to start the application
 * @module Caviar.Bootstrap
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Bootstrap', ['Config', 'IntentManager', 'Intent', 'Menu', 'HeaderBar', 'Utils/TouchStatus'], function (Config, IntentManager, Intent, Menu, HeaderBar) {
    'use strict';
    var Bootstrap;

    Bootstrap = {
        /**
         * Bootup application
         * @param {Object} configs Application configs
         */
        bootup: function (configs) {
            var that = this;
            Config.set(configs);

            if (typeof cordova !== 'undefined') {
                document.addEventListener("deviceready", function () {
                    that.onDeviceReady();
                }, false);
            } else {
                that.onDeviceReady();
            }

            IntentManager.bindIntentElements();
            HeaderBar.init();
        },

        /**
         * Setup sidebar menus
         */
        initializeMenus: function () {
            if (Config.get('hasSidebarMenu')) {
                return Menu.create();
            }
        },

        /**
         * onDeviceReady callback
         * @return {void}
         */
        onDeviceReady: function () {
            this.initializeMenus();

            IntentManager.start(new Intent('main'), function () {
                if (typeof navigator.splashscreen !== 'undefined') {
                    navigator.splashscreen.hide();
                }
            });
        }
    };

    return Bootstrap;
});