define 'UIManager', ['SFG'], (SFG) ->


	UIManager =
		
		createViewElement: (uid, layoutData) ->
			viewId = uid +  '_ci'
			el = "<div id='#{viewId}' class='ui-controler-instance next'></div>"
			
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
