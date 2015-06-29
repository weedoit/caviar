/// <reference path="App.ts" />
/// <reference path="UIManager.ts" />
/// <reference path="LayoutLoader.ts" />
/// <reference path="Controller.ts" />
module Caviar {
    /**
     * Manages instances and resources from controllers
     * @module Caviar.ControllersInstanceManager
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export module ControllersInstanceManager {
        var colletion: Object, getSequence: Function, seq: number;

        seq = 0;

        /**
         * Store all controller instances
         * @type {Object}
         */
        colletion = {};

        /**
         * Create a id for every single instance
         * @return {String}
         */
        getSequence = function () : string {
            seq += 1;
            return "uid" + seq;
        }

        /**
         * Checks if a controller instance exists
         * @param {string} key Instance Id
         */
        export function exists (key: string) {
            return colletion[key] !== undefined;
        }

        /**
         * Get a controller instance by id
         * @param  {String} key Instance id
         * @return {Mixed}      Object when is a valid id or null if isn't a valid id
         */
        export function get (key) {
            return colletion[key] || null;
        }

        /**
         * Create a new controller instance
         * @param  {Object}   intent   Intent
         * @param  {Function} callback
         * @return {void}
         */
        export function create (intent, callback) {
            var that = this,
                controllerName: string,
                instance: Controller,
                sequence: string = getSequence(),
                controllerName: string = intent.controller;

            // Create a generic controller instance for invalid controller classes.
            // This can be useful when you want to create a page that does not need a controller.
            instance = <Controller> (App[controllerName])
                ? new App[controllerName]
                : new Controller;

            instance.name = controllerName;
            instance.data = {};
            intent.controllerInstanceId = sequence;

            if (instance.beforeInitialize) {
                instance.beforeInitialize(intent);
            }

            return that.loadResources(instance, function (viewObj) {
                instance.view = UIManager.addViewToStage(viewObj, instance.data);
                instance.initialize(intent);
                colletion[sequence] = instance;
                return callback(sequence);
            });
        }

        /**
         * Load controller resources
         * @param {Object} Controller instance
         * @param {Function} callback
         * @return {void}
         */
        export function loadResources (instance, callback) {
            return LayoutLoader.load(instance.name, callback);
        }

        /**
         * Destroy data and resources created by controller
         * @return {void}
         */
        export function unloadResources (instance) {
            var el = instance.getViewElement();
            el.parentNode.removeChild(el);
        }

        /**
         * @TODO
         * Restore a destroyed view
         */
        export function restore (controllerInstance, callback) {
            // code
        }

        /**
         * Destroy a controller instance and your resources
         * @param  {String} key Instance id
         */
        export function destroy (key) {
            var controllerInstance;

            controllerInstance = this.get(key);
            controllerInstance.destroyEventListeners();
            controllerInstance.destroy();
            this.unloadResources(controllerInstance);

            delete colletion[key];
        }
    }
}