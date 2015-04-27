/*global define:true*/
/**
 * Application configs
 * @module Caviar.Config
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Config', ['Caviar'], function (Caviar) {
    'use strict';

    var Configs, configsSet;

    configsSet = {
        /**
         * App version
         * @type {String}
         */
        version: '0.0.1',

        /**
         * Enable some debug features
         * @type {String}
         */
        debug: true,

        /**
         * Define if application uses database
         * @type {Boolean}
         */
        useDatabase: false,

        /**
         * Define id application has sidebar menu
         * @type {Boolean}
         */
        hasSidebarMenu: true,

        /**
         * Navbar height (pixels)
         * @type {Integer}
         */
        navbarHeight: 50
    };

    Configs = {
        /**
         * Get a config value
         * @param  {String} key Config name
         * @return {Mixed}      Config value
         */
        get: function (key) {
            return configsSet[key];
        },

        /**
         * Set a config using key and value
         * @param {String} key   Config name
         * @param {Mixed}  value Config value
         */
        set: function (key, value) {
            if (typeof key === 'object') {
                configsSet = Caviar.merge(key, configsSet);
            } else {
                configsSet[key] = value;
            }
        }
    };

    return Configs;
});