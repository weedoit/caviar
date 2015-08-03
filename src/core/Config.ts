/// <reference path="Caviar.ts" />
module Caviar {
    var configsSet : Object;

    configsSet = {
        /**
         * App version
         * @type {String}
         */
        version: '0.0.1',

        /**
         * Define the controller that will start application
         * @type {String}
         */
        startupController: 'main',

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
    }

    /**
     * Application configs
     * @module Caviar
     * @class Config
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export class Config {
        /**
         * Get a config value
         * @param  {String} key Config name
         * @return {Mixed}      Config value
         */
        static get (key: string) : any {
            return configsSet[key];
        }

        /**
         * Set a config using key and value
         * @param {String} key   Config name
         * @param {Mixed}  value Config value
         */
        static set (key: any, value?: any) : void {
            if (typeof key === 'object') {
                configsSet = Caviar.merge(key, configsSet);
            } else {
                configsSet[key] = value;
            }
        }
    }
}
