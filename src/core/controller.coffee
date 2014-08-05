###*
 * Controller superclass.
 * This class will be used like a basic implementation that all controllers must to be
 * @module Caviar.Controller
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 *###
define 'Controller', ['IntentManager'], (IntentManager) ->
    Controller =
        ###*
         * Controller name
         * @type {String}
         *###
        name: null

        ###*
         * Vue.js instance object
         * @type {String}
         *###
        vue: null

        ###*
         * Store data used by controller
         * @type {Object}
         *###
        data: {}

        ###*
         * Methods that Vue.js will use in view
         * @type {Object}
         *###
        publicMethods: {}

        ###*
         * Init controller's settings
         * @param {Object} intentData Object with data from intent
         * @return {void}
         *###
        initialize: () ->

        ###*
         * Destroy controller's resources
         * @return {void}
         *###
        destroy: () ->
            @data = {};

        ###*
         * Get a data stored on controller instance
         * @param  {String} key
         *###
        get: (key) ->
            @data[key];

        ###*
         * Add/Update a data on controller
         * @param {String} key
         * @param {Mixed} value
         *###
        set: (key, value) ->
            @data[key] = value;

        onResume: () ->

        onResult: () ->

        ###*
         * Alias to starts an intent
         * @param {Intent}
         *###
        startIntent: (intent) ->
            IntentManager.start intent;
