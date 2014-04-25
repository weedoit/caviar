define('SFG.ScopedEvents', function () {
	var ScopedEvents;

	ScopedEvents = function () {
		var collection = {};

		this.getActionEvents = function (action) {
			if (typeof collection[action] === 'undefined') {
				collection[action] = [];
			}

			return collection[action];
		};

		this.on = function (action, event, element, callback) {
			element.on(event, callback);

			this.getActionEvents(action).push({
				event: event,
				element: element,
				callback: callback
			});
		};

		this.reset = function (action) {
			collection[action] = [];
		};

		this.clearEvents = function (action) {
			var events = this.getActionEvents(action),
				len = events.length,
				current,
				x;

			for (x = 0; x < len; x += 1) {
				current = events[x];
				current.element.off();
			}

			this.reset(action);
		};
	};

	return ScopedEvents;
});