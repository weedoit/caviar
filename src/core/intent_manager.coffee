define 'IntentManager', ['Caviar', 'Intent', 'IntentHistory', 'ControllersInstanceManager', 'UIManager'], (Caviar, Intent, IntentHistory, ControllersInstanceManager, UIManager) ->
	INDEX = 0
	CtrInstanceMgn = ControllersInstanceManager	

	IntentManager =

		getIndex: () ->
			INDEX += 1

		bindIntentElements: () ->
			$doc = $(document)

			# Windows phone fallback
			window.intentBack = (evt) ->
				try
					before = parseInt(evt.oldURL.split('#')[1] || 0, 10)
					after = parseInt(evt.newURL.split('#')[1] || 0, 10)

					return IntentManager.back() if before > after
				catch ex
					console.log ex

			window.addEventListener 'hashchange', window.intentBack, false

			$doc.on 'tap', '.caviar-back', (e) ->
				window.history.back(); 
				e.preventDefault()

			$doc.on 'tap', '.intent', (e) ->
				IntentManager.start(new Intent(@))
				window.location.hash = IntentManager.getIndex()
				e.preventDefault()


		start: (intent) ->
			isMainController = intent.controller == 'main'
			
			IntentHistory.add(intent)
			
			CtrInstanceMgn.create intent, (instanceId) ->
				if IntentHistory.hasPrev()
					UIManager.transitionIn () ->
						#if isMainController 
						
				else
					UIManager.transitionNone () ->


		back: () ->
			if IntentHistory.hasPrev()
				prev = IntentHistory.getPrev()

				controllerInstance = prev.getControllerInstance()
				controllerInstance.onResume()

				UIManager.transitionOut () ->
					console.log 'transitionOut'
					IntentHistory.removeLast()
					UIManager.destroyDeadViews()


		invokeControllerAction: (intent) ->
			controllerInstance = CtrInstanceMgn.get intent.controllerInstanceId
			controllerInstance[intent.action](intent)
			UIManager.actionTransition controllerInstance, intent.action

		onResultHandler: (intent, data) ->
			IntentManager.resume intent, data
