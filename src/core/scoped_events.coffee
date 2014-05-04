define 'ScopedEvents', () ->

	class ScopedEvents
		collection = {}

		getActionEvents: (action) ->
			if typeof collection[action] == 'undefined'
				collection[action] = []
			collection[action]


		on: (action, event, element, callback) ->
			element.on event, callback

			@getActionEvents(action).push {
				event: event
				element: element
				callback: callback
			}

		reset: (action) ->
			collection[action] = []

		clearEvents: (action) ->
			events = @getActionEvents(action)
			event.element.off() for event in events
			@reset(action);
