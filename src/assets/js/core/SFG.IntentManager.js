define(
	'SFG.IntentManager', 
	['SFG.Intent', 'SFG.IntentHistory', 'SFG.ControllersInstanceManager','SFG.UIManager'], 
	function (Intent, IntentHistory, ControllersInstanceManager, UIManager) {
		var INDEX = 0,
			Historic = [],
			IntentManager = {}; 

		IntentManager.getIndex = function () {
			INDEX += 1;
			return INDEX;
		};

		IntentManager.bindIntentElements = function () {
			var $doc = $(document),
				$window = $(window);

			$doc.on('tap click', '.intent', function (e) {
				IntentManager.start(new Intent(this));
				window.location.hash = IntentManager.getIndex();
				e.preventDefault();
			});

			window.addEventListener('hashchange', function (evt) {
				try {
					var before = evt.oldURL.split('#')[1],
						after = evt.newURL.split('#')[1];

					if (parseInt(before, 10) > parseInt(after, 10)) {
						return IntentManager.destroy(IntentHistory.removeLast());
					}
				} catch (ex) {}
			}, false);
		};

		IntentManager.start = function (intent) {
			var prevIntent = IntentHistory.getPrev();

			if (prevIntent !== null) {
				if (prevIntent.controller === intent.controller) {
					intent.controllerInstanceId = prevIntent.controllerInstanceId;
					this.invokeControllerAction(intent);
					return;
				}
			}

			ControllersInstanceManager.create(intent.controller, function (instanceId) {
				var controllerInstance;
				intent.controllerInstanceId = instanceId;

				controllerInstance = ControllersInstanceManager.get(instanceId);
				UIManager.controllerTransition(controllerInstance.view);
			});
		};

		IntentManager.resume = function (intent, data) {

		};

		IntentManager.destroy = function (intent) {
			var prevIntent = IntentHistory.getPrev(),
				currentIntent = IntentHistory.getCurrent();

			if (prevIntent !== null) {
				if (prevIntent.controller === currentIntent.controller) {
					UIManager.actionTransition(prevIntent.action); 
				} else {
					UIManager.controllerTransitionOut();
				}
			}

			return true;
		};

		IntentManager.invokeControllerAction = function (intent) {
			var controllerInstance;
			controllerInstance = ControllersInstanceManager.get(intent.controllerInstanceId);
			controllerInstance[intent.action](intent);
			UIManager.actionTransition(controllerInstance.view, intent.action);
		};

		IntentManager.setIntentResultHandler = function (intent) {
			intent.resultHandler = this.onResultHandler;
		};

		IntentManager.onResultHandler = function (intent, data) {
			IntentManager.resume(intent, data);
		};

		return IntentManager;
	}
);