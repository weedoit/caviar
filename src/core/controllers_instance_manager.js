/**
 * Manages instances and resources from controllers
 * @module Caviar.ControllersInstanceManager
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('ControllersInstanceManager', ['Caviar', 'UIManager', 'LayoutLoader'], function (Caviar, UIManager, LayoutLoader) {
	var ControllersInstanceManager, colletion, getSequence, seq;

	seq = 0;
	colletion = {};

	/**
	 * Create a id for every single instance
	 * @return {String}
	 */
	getSequence = function () {
		seq += 1;
		return "uid" + seq;
	};

	return ControllersInstanceManager = {
		exists: function (key) {
			return typeof colletion[key] !== 'undefined';
		},

		/**
		 * Get a controller instance by id
		 * @param  {String} key Instance id
		 * @return {Mixed}      Object when is a valid id or null if isn't a valid id
		 */
		get: function (key) {
			return colletion[key] || null;
		},

		/**
		 * Create a new controller instance
		 * @param  {Object}   intent   Intent
		 * @param  {Function} callback 
		 * @return {void}
		 */
		create: function (intent, callback) {
			var controller, sequence, that;
			that = this;
			sequence = getSequence();
			controller = intent.controller;

			return require([controller], function (ControllerClass) {
				var instance;
				instance = new ControllerClass();
				instance.name = controller;

				return that.loadResources(instance, function (layoutData) {
					var viewElement;

					viewElement = UIManager.createViewElement(sequence, layoutData);

					// Add way to get controller scope
					instance.helpers.scope = function () {
						return instance;
					};
					
					// Create a Vue.js instance
					instance.vue = new Vue({
						el: "#" + viewElement,
						methods: instance.helpers,
						data: instance.data
					});


					instance.initialize(intent);
					intent.controllerInstanceId = sequence;
					colletion[sequence] = instance;

					return callback(sequence);
				});
			});
		},

		/**
		 * Load controller resources
		 * @param {Object} Controller instance
		 * @param {Function} callback
		 * @return {void}
		 */
		loadResources: function (instance, callback) {
			return LayoutLoader.load(instance.name, callback);
		},

		/**
		 * Destroy data and resources created by controller
		 * @return {void}
		 */
		unloadResources: function (instance) {
			var el = instance.vue.$el;
			$(el).remove();
		},

		/**
		 * @TODO
		 * Restore a destroyed view
		 */
		restore: function (controllerInstance, callback) {
			var sequence;
			sequence = getSequence();

			return controllerInstance.loadResources(function (layoutData) {
				var view;
				view = UIManager.createViewElement(sequence, layoutData);
				UIManager.initializeLayout(view);
				controllerInstance.view = view;
				return callback;
			});
		},

		/**
		 * Destroy a controller instance and your resources
		 * @param  {String} key Instance id
		 */
		destroy: function (key) {
			var controllerInstance;

			controllerInstance = this.get(key);
			this.unloadResources(controllerInstance);
			controllerInstance.destroy();

			return delete colletion[key];
		}
	};
});