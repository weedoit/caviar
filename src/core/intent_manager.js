/**
 * Manages intents
 * @module Caviar.IntentManager
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define(
	'IntentManager', 
	['Caviar', 'Intent', 'IntentHistory', 'ControllersInstanceManager', 'UIManager', 'Menu'], 
	function (Caviar, Intent, IntentHistory, ControllersInstanceManager, UIManager, Menu) {
	var CURRENT_INDEX, CtrInstanceMgn, INDEX, IntentManager, StateHistory, result;

	INDEX = 0;
	CURRENT_INDEX = 0;
	CtrInstanceMgn = ControllersInstanceManager;
	StateHistory = History;
	result = null;

	return IntentManager = {
		/**
		 * Create a id to identify all single intent on hash url
		 * @return {Integer}
		 */
		getIndex: function () {
			return INDEX += 1;
		},

		/**
		 * Set result data
		 * @param {Mixed} data
		 */
		setResult: function (data) {
			return result = data;
		},

		/**
		 * Get result data
		 * @return {Mixed}
		 */
		getResult: function () {
			return result;
		},

		/**
		 * Clean result data
		 * @return {void}
		 */
		clearResult: function () {
			return result = null;
		},

		/**
		 * Bind events from intents
		 */
		bindIntentElements: function () {
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

			document.addEventListener('backbutton', function () {
				if (!Menu.isOpened()) {
					IntentManager.back();
				}
			}, false);

			$doc.on('tap', '.caviar-back', function (e) {
				StateHistory.back();
				return e.preventDefault();
			});
			
			return $doc.on('tap', '.intent', function (e) {
				IntentManager.start(new Intent(this));
				return e.preventDefault();
			});
		},

		/**
		 * Starts a intent
		 * @param  {Object} intent
		 */
		start: function (intent) {
			IntentHistory.add(intent);

			// Create a new controller instance and load all resources
			return CtrInstanceMgn.create(intent, function (instanceId) {
				if (IntentHistory.hasPrev()) {
					return UIManager.transitionIn(function () {
						var index = IntentManager.getIndex();
						StateHistory.pushState({index: index}, null, '?state=' + index);
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

				if (this.getResult() !== null) {
					controllerInstance.onResult(this.getResult());
					this.clearResult();
				}

				return UIManager.transitionOut(function () {
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
		 * Back to previous intent passing data
		 * @param {Mixed} data 
		 */
		result: function (data) {
			this.setResult(data);
			return StateHistory.back();
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
				return IntentHistory.add(current);
			}

			return;
		}
	};
});