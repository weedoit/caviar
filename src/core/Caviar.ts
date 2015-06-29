/**
 * Module with some utils
 * @module Caviar
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
module Caviar {
    var __globals : Object = {},
        isWP : boolean,
        getNavigatorObject : Function;

    // Checks if application are running on Windows Phone
    isWP = window.location.href.indexOf('x-wmapp0:') >= 0;

    /**
     * Wrapper to avoid TypeScript error
     **/
    getNavigatorObject = function () : any {
        return navigator;
    }

    /**
     * Main element
     * @type {Node}
     */
    export var contentBox: Node = document.querySelector('.caviar-stage-container');

    /**
     * Merge multiples configs with previous configs set.
     * @param {Object} list Object with key-value pair configs list
     */
    export function merge (origin: Object, target: Object) : Object {
        var hasProp: Function = {}.hasOwnProperty,
            item: any;

        for (item in origin) {
            if (origin.hasOwnProperty(item)) {
                target[item] = origin[item];
            }
        }

        return target;
    }

    /**
     * Checks if is as function
     * @param  {Mixed}  arg
     * @return {Boolean}
     */
    export function isFunction (arg) : Boolean {
        return typeof arg === 'function';
    }

    /**
     * Checks if application are running on Windows Phone
     * @return {Boolean} [description]
     */
    export function runningOnWP () : Boolean {
        return isWP;
    }

    export function matchSelector (element: Element, selector: string) : boolean {
        var ref: any = document.body,
            matches = ref.matches || ref.webkitMatchesSelector;

        return matches.call(element, selector);
    }

    /**
     * Exit from app
     */
    export function exit () {
        var nav : any = getNavigatorObject();

        if (nav.app) {
            return nav.app.exitApp();
        } else if (nav.device) {
            return nav.device.exitApp();
        } else {
            return console.log('[Caviar] Application supposed to be ended');
        }
    }

    export module globals {
        /**
         * Get a variable of application global scope
         * @param {String} key
         */
        export function get (key: string) : any{
            return __globals[key] || null;
        }

        /**
         * Add/update a application global scope variable
         * @param {String} key
         * @param {Mixed} value
         */
        export function set (key: string, value) : void {
            return __globals[key] = value;
        }
    }
}