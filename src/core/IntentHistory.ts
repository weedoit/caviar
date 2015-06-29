/// <reference path="Intent.ts" />

module Caviar {
    var colletion : Array<Intent> = [];

    /**
     * Stores started intents history
     * @module Caviar.IntentHistory
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export module IntentHistory {
        /**
         * Add an intent in history
         * @param {Intent} intent
         */
        export function add (intent: Intent) {
            return colletion.push(intent);
        }

        /**
         * Return current intent or null if not have intent started
         * @return {Intent}
         */
        export function getCurrent () : Intent {
            return colletion[colletion.length - 1] || null;
        }

        /**
         * Return previous intent or null if not exists
         * @return {Intent}
         */
        export function getPrev () : Intent{
            return colletion[colletion.length - 2] || null;
        }

        /**
         * Remove an intent from history
         * @param {Intent} intent
         */
        export function remove (intent) : void {
            var index : number = colletion.indexOf(intent);

            if (index > -1) {
                colletion.splice(index, 1);
            }
        }

        /**
         * Remove last intent of history
         * @return {Intent}
         */
        export function removeLast () : Intent {
            return colletion.pop();
        }

        /**
         * Returns full history
         * @return {Array}
         */
        export function all () : Array<Intent> {
            return colletion;
        }

        /**
         * Returns history length
         * @return {Number}
         */
        export function count () : number {
            return colletion.length;
        }

        /**
         * Clear intents history
         * @return {Array}
         */
        export function clear () : Array<Intent> {
            return colletion = [];
        }

        /**
         * Check if exists a prev intent on stack
         * @return {boolean}
         */
        export function hasPrev () : boolean {
            return colletion.length > 1;
        }
    }
}