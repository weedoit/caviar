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
			var controller, sequence, that, module;

			that = this;
			sequence = getSequence();
			controller = intent.controller;
			module = (hasModule(controller)) ? controller : 'Controller';


			return require([module], function (ControllerClass) {
				var instance, klass;

				// Force new instance from object
				if (typeof ControllerClass === 'object') {
					klass = function () {}
					klass.prototype = ControllerClass;
				} else {
					klass = ControllerClass;
				}

				// Create controller instance
				instance = new klass();
				instance.name = controller;
				intent.controllerInstanceId = sequence;

				return that.loadResources(instance, function (layoutData) {
					var viewElementId = UIManager.createViewElement(sequence, layoutData);
					
					that.applyMVVM(instance, viewElementId);
					instance.initialize(intent);
					colletion[sequence] = instance;

					return callback(sequence);
				});
			});
		},

		/**
		 * Apply Vue.js to instance of controller
		 * @param  {Object} instance      Instance of controller
		 * @param  {String} viewElementId Id of DOMElement of view
		 * @return {void}
		 */
		applyMVVM: function (instance, viewElementId) {
			// Add way to get controller scope
			instance.helpers.scope = function () {
				return instance;
			};
			
			// Create a Vue.js instance
			instance.vue = new Vue({
				el: "#" + viewElementId,
				methods: instance.helpers,
				data: instance.data
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