define 'IntentManager', ['Caviar', 'Intent', 'IntentHistory', 'ControllersInstanceManager', 'UIManager'], (Caviar, Intent, IntentHistory, ControllersInstanceManager, UIManager) ->
	INDEX = 0
	CtrInstanceMgn = ControllersInstanceManager	

	IntentManager =

		getIndex: () ->
			INDEX += 1

		bindIntentElements: () ->
			$doc = $(document)

			$doc.on 'click', '.intent', (e) ->
				#snapper = Caviar.globals.get 'snapper'
				#snapper.close() unless snapper == null

				IntentManager.start(new Intent(@))
				window.location.hash = IntentManager.getIndex()
				e.preventDefault()

			window.addEventListener 'hashchange', (evt) ->
				try
					before = evt.oldURL.split('#')[1] || 0
					after = evt.newURL.split('#')[1] || 0
					return IntentManager.back() if (parseInt(before, 10) > parseInt(after, 10))
				catch ex
			, false


		start: (intent) ->
			IntentHistory.add(intent)
			IntentManager.setIntentResultHandler(intent)
			prevIntent = IntentHistory.getPrev()

			CtrInstanceMgn.create intent, (instanceId) ->
				if IntentHistory.hasPrev()
					UIManager.transitionIn () ->
						console.log(1)
				else
					UIManager.transitionNone () ->
						console.log(2)

				

		back: () ->
			prevIntent = IntentHistory.getPrev()
			currentIntent = IntentHistory.getCurrent()
			currentCtrInstance = CtrInstanceMgn.get currentIntent.controllerInstanceId
			keepResources = false

			return if prevIntent == null

			if prevIntent.controller == currentIntent.controller
				keepResources = true

				UIManager.actionTransition currentCtrInstance, prevIntent.action, () ->
					IntentManager.destroy currentIntent, keepResources
			else
				prevCtrInstance = CtrInstanceMgn.get prevIntent.controllerInstanceId
				args =
					prev:
						intent: currentIntent
						controllerInstance: currentCtrInstance
					next:
						intent: prevIntent
						controllerInstance: prevCtrInstance


				if (!prevIntent.forResult)
					CtrInstanceMgn.restor prevCtrInstance, () ->
						UIManager.controllerTransition args, () ->
							IntentManager.destroy currentIntent, keepResources

				else
					UIManager.controllerTransition args, () ->
						IntentManager.destroy currentIntent, keepResources

			return true;

		resume: (intent, data) ->
			prevIntent = IntentHistory.getPrev()
			currentIntent = intent
			currentCtrInstance = CtrInstanceMgn.get currentIntent.controllerInstanceId
			prevCtrInstance = CtrInstanceMgn.get prevIntent.controllerInstanceId
			keepResources = false

			args =
				prev:
					intent: currentIntent
					controllerInstance: currentCtrInstance
				next:
					intent: prevIntent
					controllerInstance: prevCtrInstance


			prevCtrInstance.onResultHandler data;

			if prevIntent.controller == currentIntent.controller
				UIManager.actionTransition currentCtrInstance, prevIntent.action, () ->
					keepResources = true
					IntentManager.destroy currentIntent, keepResources
			else
				UIManager.controllerTransition args, () ->
					IntentManager.destroy currentIntent, keepResources

		destroy: (intent, keepResources) ->
			keepResources_ = keepResources || false
			controllerInstance = CtrInstanceMgn.get intent.controllerInstanceId

			controllerInstance.unloadResources() if keepResources_ == false
			controllerInstance.eventsScope.clearEvents intent.action
			IntentHistory.remove intent

		invokeControllerAction: (intent) ->
			controllerInstance = CtrInstanceMgn.get intent.controllerInstanceId
			controllerInstance[intent.action](intent)
			UIManager.actionTransition controllerInstance, intent.action

		setIntentResultHandler: (intent) ->
			intent.resultHandler = @onResultHandler

		onResultHandler: (intent, data) ->
			IntentManager.resume intent, data
