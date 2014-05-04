define 'UIManager', ['SFG'], (SFG) ->

	MINZINDEX = 1
	MAXZINDEX = 2

	UIManager =
		actionTransition: (controllerInstance, action, callback) ->
			view = controllerInstance.view
			viewsActions = view.find '.action'
			nextAction = @getActionElement view, action
			transition = controllerInstance.transition
			waitTransition = @waitTransition
			_callback = callback || () ->

			if transition == null
				viewsActions.removeClass 'actived-action'
				nextAction.addClass 'actived-action'
				_callback();
			else
				activedAction = view.find '.action.actived-action'

				if activedAction.length > 0
					waitTransition view, () ->
						activedAction.removeClass 'actived-action'
						nextAction.addClass 'actived-action'

						waitTransition nextAction, () ->
							_callback()

						view.removeClass transition

					view.addClass transition
				else
					nextAction.addClass 'actived-action'
					_callback()

		controllerTransition: (data, callback) ->
			nextIntent = data.next.intent
			nextControllerInstance = data.next.controllerInstance
			prevIntent = data.prev.intent
			prevControllerInstance = data.prev.controllerInstance
			_callback = callback || () ->
			waitTransition = this.waitTransition

			if prevIntent == null
				nextView = nextControllerInstance.view
				UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
				_callback()
				return

			prevView = prevControllerInstance.view
			nextView = nextControllerInstance.view

			if nextIntent.forResult

				if prevControllerInstance.transition != null
					prevView.css 'z-index', MAXZINDEX
					nextView.css 'z-index', MINZINDEX

					if nextControllerInstance.transition != null
						waitTransition prevView, () ->
							UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
							nextView.removeClass nextControllerInstance.transition
							_callback()

						prevView.addClass nextControllerInstance.transition
					else
						waitTransition prevView, () ->
							UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
							_callback()

						prevView.addClass nextControllerInstance.transition

				else
					prevView.css 'z-index', MINZINDEX
					nextView.css 'z-index', MAXZINDEX

					if nextControllerInstance.transition != null
						waitTransition prevView, () ->
							UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
							nextView.removeClass nextControllerInstance.transition

						nextView.addClass prevControllerInstance.transition
					else
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
						_callback()
						return

			else
				prevView.css 'z-index', MAXZINDEX
				nextView.css 'z-index', MINZINDEX

				if prevControllerInstance.transition != null
					if nextControllerInstance.transition != null
						waitTransition prevView, () ->
							UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
							nextView.removeClass nextControllerInstance.transition
							_callback()

						prevView.addClass prevControllerInstance.transition
						nextView.addClass nextControllerInstance.transition
					else
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')

						waitTransition prevView, (e) ->
							_callback()

						prevView.addClass prevControllerInstance.transition

				else
					if nextControllerInstance.transition != null
						waitTransition prevView, () ->
							UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
							nextView.removeClass(nextControllerInstance.transition)
							_callback();

						nextView.addClass(prevControllerInstance.transition)
					else
						prevView.find('.actived-action').removeClass('actived-action')
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action')
						_callback()

		createViewElement: (uid, layoutData) ->
			viewId = uid +  '_view'
			el = "<div id=\"#{viewId}\" class=\"controller_view\"></div>"
			SFG.contentBox.append(el)
			view = $('#' + viewId)
			view.html layoutData
			view


		initializeLayout: (view) ->
			UIManager.addTransitionClassToElements view

		addTransitionClassToElements: (view) ->
			view.addClass('transition');

		waitTransitio: (element, callback) ->
			element.one 'webkitTransitionEnd transitionend MSTransitionEnd', callback

		getActionElement: (view, action) ->
			view.find('.action[data-action="' + action + '"]')
