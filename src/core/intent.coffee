define 'Intent', () ->
    class Intent
        ###*
         * Constructor
         * @param {Object} element DOM Element that calls a intent
         *###
        constructor: (element) ->
            unless typeof element == 'undefined'
                if typeof element == 'string'
                    @parseControllerAndActionsName(element)
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
         * When not null will calls a action from current instance controller
         * @type {string}
         *###
        action: 'main'

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
            @parseControllerAndActionsName($element.data('intent'))
            return

        ###*
         * Parse controller name
         *###
        parseControllerAndActionsName: (intentPath) ->
            splits = intentPath.split('#')

            @controller = splits[0].replace(/^([a-z])|_([a-z])/g, ($1) ->
                $1.toUpperCase()
            ).replace(/(\s|_)/, '') + 'Controller'

            @action = splits[1] || 'main'
            return
