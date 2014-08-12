/**
 * Manages intents
 * @module Caviar.IntentManager
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('IntentManager', ['Caviar', 'Intent', 'IntentHistory', 'ControllersInstanceManager', 'UIManager'], function(Caviar, Intent, IntentHistory, ControllersInstanceManager, UIManager) {
	var CURRENT_INDEX, CtrInstanceMgn, INDEX, IntentManager, StateHistory;

	INDEX = 0;
	CURRENT_INDEX = 0;
	CtrInstanceMgn = ControllersInstanceManager;
	StateHistory = History;

	return IntentManager = {
		/**
		 * Create a id to identify all single intent on hash url
		 * @return {Integer}
		 */
		getIndex: function() {
			return INDEX += 1;
		},

		/**
		 * Bind events from intents
		 */
		bindIntentElements: function() {
			var $doc;
			$doc = $(document);

			StateHistory.Adapter.bind(window, 'statechange', function () {
				var currentIndex, prevIndex, state;
				state = StateHistory.getState();
				prevIndex = CURRENT_INDEX;
				currentIndex = state.data.index || 0;

				if (prevIndex > currentIndex) {
					IntentManager.back();
				}

				CURRENT_INDEX = currentIndex;
			});

			$doc.on('tap', '.caviar-back', function(e) {
				window.history.back();
				return e.preventDefault();
			});
			
			return $doc.on('tap', '.intent', function(e) {
				IntentManager.start(new Intent(this));
				return e.preventDefault();
			});
		},

		/**
		 * Starts a intent
		 * @param  {Object} intent
		 */
		start: function(intent) {
			var index;
			index = IntentManager.getIndex();

			IntentHistory.add(intent);
			StateHistory.pushState({index: index}, null, "?state=" + index);

			// Create a new controller instance and load all resources
			return CtrInstanceMgn.create(intent, function(instanceId) {
				if (IntentHistory.hasPrev()) {
					return UIManager.transitionIn(function() {
						return IntentManager.clearStack(intent);
					});
				} else {
					// Start controller without transitions
					return UIManager.transitionNone();
				}
			});
		},

		/**
		 * Back to previous intent
		 */
		back: function () {
			var controllerInstance, prev;

			if (IntentHistory.hasPrev()) {
				prev = IntentHistory.getPrev();
				controllerInstance = prev.getControllerInstance();
				controllerInstance.onResume();

				return UIManager.transitionOut(function() {
					var last = IntentHistory.removeLast();
					return CtrInstanceMgn.destroy(last.controllerInstanceId);
				});
			} else {
				// Close application when have no more instances to back
				// Its requires Cordova script included
				return Caviar.exit();
			}
		},

		/**
		 * When start a intent with main controller destroy all previous controller instances.
		 * This happens because understand that if the User back to the main screen of the application 
		 * it will not have the intention to return to the previous screen.
		 * @param  {Object} intent Started intent
		 */
		clearStack: function (intent) {
			var all, count, current, x, len, cIntent;

			if (intent.controller === 'MainController') {
				current = IntentHistory.getCurrent();
				all = IntentHistory.all();
				count = all.length;
				len = count - 1;

				// Destroy all previous controller instances
				for (x = 0; x < len; x += 1) {
					cIntent = all[x];
					ControllersInstanceManager.destroy(cIntent.controllerInstanceId);
				}

				IntentHistory.clear();
				IntentHistory.add(current);

				// Reset pushState
				return window.history.go((count + 1) * -1);
			}

			return;
		}
	};
});