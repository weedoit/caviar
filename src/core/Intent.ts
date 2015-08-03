module Caviar {
    /**
     * Represents a intention to go to a other controller
     * @module Caviar
     * @class Intent
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export class Intent {
        /**
         * Controller that will be called
         * @type {string}
         */
        controller: string = null;

        /**
         * Controller instance Id
         * @type {string}
         */
        controllerInstanceId: string = null;

        /**
         * Optional data to controller
         * @type {Object}
         */
        data: Object = null;

        /**
         * If true, returns data for previous screen instance
         * @type {Boolean}
         */
        forResult: boolean = false;

        /**
         * Transition effect
         * @type {Object}
         */
        transition: string = 'show';

        /**
         * Element that was invoked intent
         * @type {Object}
         */
        caller: Element = null;

        /**
         * Constructor
         * @param {Object} element DOM Element that calls a
         *                         intent or string with controller name
         */
        constructor (element: any) {
            this.data = {};

            if (element !== undefined) {
                if (typeof element === 'string') {
                    this.parseControllerName(element);
                } else if (typeof element === 'object') {
                    this.parseIntentElement(element);
                    this.caller = element;
                }
            }
        }

        /**
         * Mount a intent from a element
         * @param  {Object} element DOM Element that calls a intent
         */
        parseIntentElement (element: Element) {
            var intentData, intentForResult, transition;

            intentData = element.getAttribute('intent-data');
            intentForResult = element.getAttribute('intent-forResults');
            transition = element.getAttribute('intent-transition');

            if (intentData !== null && (intentData.charAt(0) === '[' || intentData.charAt(0) === '{')) {
                this.data = JSON.parse(intentData);
            } else {
                this.data = {};
            }

            this.transition = (transition !== null) ? transition : 'show';
            this.forResult = (intentForResult !== null && intentForResult === 'true') ? true : false;
            this.parseControllerName(element.getAttribute('intent'));
        }

        /**
         * Parse controller name
         */
        parseControllerName (intentPath: string) {
            this.controller = intentPath.replace(/^([a-z])|_([a-z])/g, function ($1) {
                return $1.toUpperCase();
            }).replace(/(\s|_)/g, '') + 'Controller';
        }
    }
}
