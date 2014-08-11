/**
 * Represents a intention to go to a other controller
 * @module Caviar.Intent
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Intent', ['ControllersInstanceManager'], function(ControllersInstanceManager) {
	var Intent;

	return Intent = (function() {
		/**
		 * Constructor
		 * @param {Object} element DOM Element that calls a intent
		 */
		function Intent(element) {
			if (typeof element !== 'undefined') {
				if (typeof element === 'string') {
					this.parseControllerName(element);
				} else if (typeof element === 'object') {
					this.parseIntentElement(element);
					this.caller = element;
				}
			}
		}

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
		Intent.prototype.data = {};

		/**
		 * If true, returns data for previous screen instance
		 * @type {Boolean}
		 */
		Intent.prototype.forResult = false;

		/**
		 * Mount a intent from a element
		 * @param  {Object} element DOM Element that calls a intent
		 */
		Intent.prototype.parseIntentElement = function(element) {
			var $element, intentData, intentForResult;
			$element = $(element);
			intentData = $element.data('intent-data') || {};
			intentForResult = $element.data('intent-forResults') || false;
			this.data = intentData;
			this.forResult = intentForResult;
			this.parseControllerName($element.data('intent-path'));
		};

		/**
		 * Parse controller name
		 */
		Intent.prototype.parseControllerName = function(intentPath) {
			this.controller = intentPath.replace(/^([a-z])|_([a-z])/g, function($1) {
				return $1.toUpperCase();
			}).replace(/(\s|_)/, '') + 'Controller';
		};

		/**
		 * Returns a controller instance 
		 * @return {Object}
		 */
		Intent.prototype.getControllerInstance = function() {
			return ControllersInstanceManager.get(this.controllerInstanceId);
		};

		return Intent;
	})();
});
