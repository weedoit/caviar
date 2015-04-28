/*global define:true*/
/**
 * Represents a intention to go to a other controller
 * @module Caviar.Intent
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Intent', ['ControllersInstanceManager'], function (ControllersInstanceManager) {

    return (function () {
        var Intent;

        /**
         * Constructor
         * @param {Object} element DOM Element that calls a intent
         */
        Intent = function (element) {
            if (element !== undefined) {
                if (typeof element === 'string') {
                    this.parseControllerName(element);
                } else if (typeof element === 'object') {
                    this.parseIntentElement(element);
                    this.caller = element;
                }
            }

            this.data = {};
        };

        /**
         * Controller that will be called
         * @type {string}
         */
        Intent.prototype.controller = null;

        /**
         * Controller instance Id
         * @type {string}
         */
        Intent.prototype.controllerInstanceId = null;

        /**
         * Optional data to controller
         * @type {Object}
         */
        Intent.prototype.data = null;

        /**
         * Optional data to controller
         * @type {Object}
         */
        Intent.prototype.transition = 'show';

        /**
         * If true, returns data for previous screen instance
         * @type {Boolean}
         */
        Intent.prototype.forResult = false;

        /**
         * Mount a intent from a element
         * @param  {Object} element DOM Element that calls a intent
         */
        Intent.prototype.parseIntentElement = function (element) {
            var intentData, intentForResult, transition;

            intentData = element.getAttribute('intent-data');
            intentForResult = element.getAttribute('intent-forResults');
            transition = element.getAttribute('intent-transition');

            if (intentData !== null && (intentData.charAt(0) === '[' || intentData.charAt(0) === '{')) {
                this.data = JSON.stringify(intentData);
            } else {
                this.data = {};
            }

            this.transition = (transition !== null) ? transition : 'show';
            this.forResult = (intentForResult !== null && intentForResult === 'true') ? true : false;
            this.parseControllerName(element.getAttribute('intent'));
        };

        /**
         * Parse controller name
         */
        Intent.prototype.parseControllerName = function (intentPath) {
            this.controller = intentPath.replace(/^([a-z])|_([a-z])/g, function ($1) {
                return $1.toUpperCase();
            }).replace(/(\s|_)/g, '') + 'Controller';
        };

        /**
         * Returns a controller instance
         * @return {Object}
         */
        Intent.prototype.getControllerInstance = function () {
            return ControllersInstanceManager.get(this.controllerInstanceId);
        };

        return Intent;
    }());
});
