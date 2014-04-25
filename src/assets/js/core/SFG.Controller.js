/**
 * Controller superclass. 
 * This class will be used like a basic implementation that all controllers must to be
 * @module SFG.Controller
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('SFG.Controller', 
	['SFG.LayoutLoader', 'SFG.IntentManager', 'SFG.IntentHistory', 'SFG.ScopedEvents'],
	function (LayoutLoader, IntentManager, IntentHistory, ScopedEvents) {
		var Controller;

		Controller = {
			/**
			 * Transition effect used by controller
			 * @type {String}
			 */
			transition: null,

			/**
			 * Controller name
			 * @type {String}
			 */
			name: null,

			/**
			 * Zepto object from controller layout
			 * @type {Object}
			 */
			view: null,

			/**
			 * Store data used by controller
			 * @type {Object}
			 */
			data: {},

			/**
			 * Init controller's settings
			 * @param {Object} intentData Object with data from intent
			 * @return {void}
			 */
			initialize: function () {

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
			},

			/**
			 * Load controller resources
			 * @param  {Function} callback
			 * @return {void}
			 */
			loadResources: function (callback) {
				LayoutLoader.load(this.name, callback);
			},

			/**
			 * Destroy data and resources created by controller
			 * @return {[type]} [description]
			 */
			unloadResources: function () {
				if (this.view !== null) {
					this.view.remove();
					this.data = null;
				}
			},

			onResultHandler: function (data) {},

			waitForResult: function (callback) {
				this.onResultHandler = callback;
			},

			getViewByAction: function (action) {
				return this.view.find('.action[data-action="' + action + '"]');
			},

			startIntent: function (intent) {
				IntentManager.start(intent);
			},

			on: function (event, element, callback) {
				var currentIntent = IntentHistory.getCurrent();
				this.eventsScope.on(currentIntent.action, event, element, callback);
			},

			eventsScope: new ScopedEvents()
		};

		return Controller;
	}
);