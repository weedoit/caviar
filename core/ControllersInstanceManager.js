/*global define:true, hasModule:true */
/**
 * Manages instances and resources from controllers
 * @module Caviar.ControllersInstanceManager
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('ControllersInstanceManager', ['UIManager', 'LayoutLoader', 'View'], function (UIManager, LayoutLoader, View) {
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

    ControllersInstanceManager = {
        exists: function (key) {
            return colletion[key] !== undefined;
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
                var instance, Klass;

                // Force new instance from object
                if (typeof ControllerClass === 'object') {
                    Klass = function () {
                        return this;
                    };
                    Klass.prototype = ControllerClass;
                } else {
                    Klass = ControllerClass;
                }

                // Create controller instance
                instance = new Klass();
                instance.name = controller;
                instance.data = {};
                intent.controllerInstanceId = sequence;

                if (instance.beforeInitialize) {
                    instance.beforeInitialize(intent);
                }

                return that.loadResources(instance, function (viewObj) {
                    instance.view = View.addToStage(viewObj, instance.data);
                    instance.initialize(intent);
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
            var el = instance.getViewElement();
            el.parentNode.removeChild(el);
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

    return ControllersInstanceManager;
});