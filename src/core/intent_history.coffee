define 'IntentHistory', ['Intent'], (Intent) ->
    colletion = []
    IntentHistory =
        ###*
         * Add an intent in history
         * @param {Intent} intent
         *###
        add: (intent) ->
            colletion.push(intent)

        ###*
         * Return current intent or null if not have intent started
         * @return {Intent}
         *###
        getCurrent: () ->
            colletion[colletion.length - 1] || null

        ###*
         * Return previous intent or null if not exists
         * @return {Intent}
         *###
        getPrev: () ->
            colletion[colletion.length - 2] || null

        ###*
         * Remove an intent from history
         * @param {Intent} intent
         *###
        remove: (intent) ->
            index = colletion.indexOf(intent)
            colletion.splice(index, 1) if index > -1
            return

        ###*
         * Remove last intent of history
         * @return {Intent}
         *###
        removeLast: () ->
            return colletion.pop()

        ###*
         * Returns full history
         * @return {Array}
         *###
        all: () ->
            return colletion

        ###*
         * Clear intents history
         * @return {Array}
         *###
        clear: () ->
            colletion = []

        ###*
         * Clear intents history
         * @return {Array}
         *###
        hasPrev: () ->
            colletion.length > 1
