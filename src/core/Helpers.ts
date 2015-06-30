/// <reference path="defs/handlebars/handlebars.d.ts" />
module Caviar {
    /**
     * Manages Handlebars helpers
     * @module Caviar.Helpers
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export module Helpers {
        /**
         * Registra a new helper
         * @param {string}   name Helper name
         * @param {Function} def  Helper definition
         */
        export function register (name: string, def: Function) {
            Handlebars.registerHelper(name, def);
        }
    }
}