define 'IntentManager', ['Caviar', 'Intent', 'IntentHistory', 'ControllersInstanceManager', 'UIManager'], (Caviar, Intent, IntentHistory, ControllersInstanceManager, UIManager) ->
	INDEX = 0
	CURRENT_INDEX = 0

	CtrInstanceMgn = ControllersInstanceManager	
	StateHistory = History


	IntentManager =

		getIndex: () ->
			INDEX += 1

		bindIntentElements: () ->
			$doc = $(document)

			StateHistory.Adapter.bind(window, 'statechange', () ->
				state = StateHistory.getState();
				prevIndex = CURRENT_INDEX
				currentIndex = state.data.index || 0

				if prevIndex > currentIndex 
					# Backing controller
					IntentManager.back()
				else 
					# Starting a new controller

				CURRENT_INDEX = currentIndex
				return
			)

			$doc.on 'tap', '.caviar-back', (e) ->
				window.history.back() 
				e.preventDefault()

			$doc.on 'tap', '.intent', (e) ->
				IntentManager.start(new Intent(@))
				e.preventDefault()

		start: (intent) ->
			IntentHistory.add(intent)
			index = IntentManager.getIndex()
			StateHistory.pushState {index: index}, null, "?state=#{index}"

			CtrInstanceMgn.create intent, (instanceId) ->
				if IntentHistory.hasPrev()
					UIManager.transitionIn () ->
						IntentManager.clearStack(intent)		
				else
					UIManager.transitionNone()

		back: () ->
			if IntentHistory.hasPrev()
				prev = IntentHistory.getPrev()

				controllerInstance = prev.getControllerInstance()
				controllerInstance.onResume()

				UIManager.transitionOut () ->
					IntentHistory.removeLast()
					UIManager.destroyDeadViews()
			else
				Caviar.exit()

		clearStack: (intent) ->
			if intent.controller == 'MainController'
				console.log 'oi'
				current = IntentHistory.getCurrent()
				count = IntentHistory.count()

				IntentHistory.clear()
				IntentHistory.add(current)
				window.history.go((count + 1) * -1)
				UIManager.destroyBackgroundedViews(intent)









