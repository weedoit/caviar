define 'Intent', () ->
    class Intent
        ###*
         * Constructor
         * @param {Object} element DOM Element that calls a intent
         *###
        constructor: (element) ->
            unless typeof element == 'undefined'
                if typeof element == 'string'
                    @parseControllerName(element)
                else if typeof element == 'object'
                    @parseIntentElement(element)
                    @caller = element;

        ###*
         * Controller that will be called
         * @type {string}
         *###
        controller: null

        ###*
         * Controller instance Id
         * @type {string}
         *###
        controllerInstanceId: null

        ###*
         * Optional data to controller
         * @type {Object}
         *###
        data: {}

        ###*
         * If true, returns data for previous screen instance
         * @type {Boolean}
         *###
        forResult: false

        ###*
         * Result callback
         * @param {Object} data Data that will be sent to the origin intent
         *###
        resultHandler: (data) ->

        ###*
         * Send data result to origin intent
         * @type {Boolean}
         *###
        result: (data) ->
            @resultHandler(@, data)

        ###*
         * Mount a intent from a element
         * @param  {Object} element DOM Element that calls a intent
         *###
        parseIntentElement: (element) ->
            $element = $(element)
            intentData = $element.data('intent-data') || {}
            intentForResult = $element.data('intent-forResults') || false

            @data = intentData
            @forResult = intentForResult
            @parseControllerName($element.data('intent-path'))
            return

        ###*
         * Parse controller name
         *###
        parseControllerName: (intentPath) ->
            @controller = intentPath.replace(/^([a-z])|_([a-z])/g, ($1) ->
                $1.toUpperCase()
            ).replace(/(\s|_)/, '') + 'Controller'

            return
