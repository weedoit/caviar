/**
 * Controller superclass. 
 * This class will be used like a basic implementation that all controllers must to be
 * @module SFG.Controller
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('SFG.Controller', function () {
	var Controller;

	Controller = {
		data: {},

		/**
		 * Init controller's settings
		 * @param {Object} intentData Object with data from intent
		 * @return {void}
		 */
		initialize: function (intentData) {

		},

		/**
		 * Destroy controller's resources
		 * @return {void}
		 */
		destroy: function () {
			this.data = {};
		},

		/**
		 * Get a data stored on controller instance
		 * @param  {String} key
		 */
		get: function (key) {
			return this.data[key];
		},

		/**
		 * Add/Update a data on controller
		 * @param {String} key
		 * @param {Mixed} value
		 */
		set: function (key, value) {
			this.data[key] = value;
		}
	};

	return Controller;
});