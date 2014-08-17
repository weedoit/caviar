/**
 * Controller superclass.
 * This class will be used like a basic implementation that all controllers must to be
 * @module Caviar.Controller
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Controller', ['IntentManager'], function (IntentManager) {
	var Controller;

	return Controller = {
		/**
		 * Controller name
		 * @type {String}
		 */
		name: null,

		/**
		 * Vue.js instance object
		 * @type {String}
		 */
		vue: null,

		/**
		 * Store data used by controller
		 * @type {Object}
		 */
		data: {},

		/**
		 * Methods that Vue.js will use in view
		 * @type {Object}
		 */
		helpers: {},

		/**
		 * Init controller's settings
		 * @param {Object} intentData Object with data from intent
		 * @return {void}
		 */
		initialize: function () {},

		/**
		 * Destroy controller's resources
		 * @return {void}
		 */
		destroy: function () {
			return this.data = {};
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
			return this.data[key] = value;
		},

		/**
		 * Callback called when a controller instance back to front
		 */
		onResume: function () {},

		/**
		 * @TODO
		 * Callback called when a controller instance receives data from another
		 */
		onResult: function (data) {},

		/**
		 * Alias to starts an intent
		 * @param {Intent}
		 *
		 */
		startIntent: function (intent) {
			return IntentManager.start(intent);
		}
	};
});