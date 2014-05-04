define('SFG.IntentManager', 
	['SFG', 'SFG.Intent', 'SFG.IntentHistory', 'SFG.ControllersInstanceManager', 'SFG.UIManager'], 
	function (SFG, Intent, IntentHistory, ControllersInstanceManager, UIManager) {
		var INDEX = 0,
			IntentManager = {},
			CtrInstanceMgn = ControllersInstanceManager; 

		IntentManager.getIndex = function () {
			INDEX += 1;
			return INDEX;
		};

		IntentManager.bindIntentElements = function () {
			var $doc = $(document),
				$window = $(window);

			$doc.on('click', '.intent', function (e) {
				var snapper = SFG.globals.get('snapper');
				if (snapper !== null) {
					snapper.close();
				}

				IntentManager.start(new Intent(this));
				window.location.hash = IntentManager.getIndex();
				e.preventDefault();
			});

			window.addEventListener('hashchange', function (evt) {
				try {
					var before = evt.oldURL.split('#')[1] || 0,
						after = evt.newURL.split('#')[1] || 0;

					if (parseInt(before, 10) > parseInt(after, 10)) {
						return IntentManager.back();
					} 
				} catch (ex) {}
			}, false);
		};

		IntentManager.start = function (intent) {
			var prevIntent;

			IntentHistory.add(intent);
			IntentManager.setIntentResultHandler(intent);
			prevIntent = IntentHistory.getPrev();

			if (prevIntent !== null) {
				if (prevIntent.controller === intent.controller) {
					intent.controllerInstanceId = prevIntent.controllerInstanceId;
					this.invokeControllerAction(intent);
					return;
				}
			}

			CtrInstanceMgn.create(intent.controller, function (instanceId) {
				var prevCtrInstance = (prevIntent !== null) ? CtrInstanceMgn.get(prevIntent.controllerInstanceId) : null,
					nextCtrInstance,
					args;

				intent.controllerInstanceId = instanceId;
				nextCtrInstance = CtrInstanceMgn.get(instanceId);

				args = {
					prev: {
						intent: prevIntent,
						controllerInstance: prevCtrInstance
					},
					next: {
						intent: intent,
						controllerInstance: nextCtrInstance
					}
				};

				nextCtrInstance[intent.action](intent);
				UIManager.controllerTransition(args, function () {
					if (!intent.forResult && prevIntent !== null) {
						prevCtrInstance.unloadResources();
					}
				});
			});
		};

		IntentManager.back = function () {
			var prevIntent = IntentHistory.getPrev(),
				currentIntent = IntentHistory.getCurrent(),
				currentCtrInstance = CtrInstanceMgn.get(currentIntent.controllerInstanceId),
				keepResources = false,
				prevCtrInstance,
				args;

			if (prevIntent === null) {
				return;
			}

			if (prevIntent.controller === currentIntent.controller) {
				keepResources = true;

				UIManager.actionTransition(currentCtrInstance, prevIntent.action, function () {
					IntentManager.destroy(currentIntent, keepResources);
				});
			} else {
				prevCtrInstance = CtrInstanceMgn.get(prevIntent.controllerInstanceId);
				args = {
					prev: {
						intent: currentIntent,
						controllerInstance: currentCtrInstance
					},
					next: {
						intent: prevIntent,
						controllerInstance: prevCtrInstance
					}
				};

				if (!prevIntent.forResult) {
					CtrInstanceMgn.restore(prevCtrInstance, function () {
						UIManager.controllerTransition(args, function () {
							IntentManager.destroy(currentIntent, keepResources);
						});
					});
				} else {
					UIManager.controllerTransition(args, function () {
						IntentManager.destroy(currentIntent, keepResources);
					});
				}
			}

			return true;
		};

		IntentManager.resume = function (intent, data) {
			var prevIntent = IntentHistory.getPrev(),
				currentIntent = intent,
				currentCtrInstance = CtrInstanceMgn.get(currentIntent.controllerInstanceId),
				prevCtrInstance = CtrInstanceMgn.get(prevIntent.controllerInstanceId),
				keepResources = false,
				args;

			args = {
				prev: {
					intent: currentIntent,
					controllerInstance: currentCtrInstance
				},
				next: {
					intent: prevIntent,
					controllerInstance: prevCtrInstance
				}
			};

			prevCtrInstance.onResultHandler(data);

			if (prevIntent.controller === currentIntent.controller) {
				UIManager.actionTransition(currentCtrInstance, prevIntent.action, function () {
					keepResources = true;
					IntentManager.destroy(currentIntent, keepResources);
				});
			} else {
				UIManager.controllerTransition(args, function () {
					IntentManager.destroy(currentIntent, keepResources);
				});
			}
		};

		IntentManager.destroy = function (intent, keepResources) {
			var keepResources_ = keepResources || false,
				controllerInstance = CtrInstanceMgn.get(intent.controllerInstanceId);

			if (keepResources_ === false) {
				controllerInstance.unloadResources();
			}

			controllerInstance.eventsScope.clearEvents(intent.action);
			IntentHistory.remove(intent);
		};

		IntentManager.invokeControllerAction = function (intent) {
			var controllerInstance;
			controllerInstance = CtrInstanceMgn.get(intent.controllerInstanceId);
			controllerInstance[intent.action](intent);
			UIManager.actionTransition(controllerInstance, intent.action);
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