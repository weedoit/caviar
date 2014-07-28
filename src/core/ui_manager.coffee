define 'UIManager', ['Caviar'], (Caviar) ->
	ANIMATIONS_EVENTS = 'webkitAnimationEnd oanimationend msAnimationEnd animationend'
	$stage = $('.caviar-stage')

	UIManager =
		createViewElement: (uid, layoutData) ->
			viewId = uid +  '_ci'
			el = "<div id='#{viewId}' class='caviar-ui-controler-instance caviar-next'>#{layoutData}</div>"
			Caviar.contentBox.append(el)
			viewId


		initializeLayout: (view) ->
			UIManager.addTransitionClassToElements view

		addTransitionClassToElements: (view) ->
			view.addClass('transition');

		waitTransitio: (element, callback) ->
			element.one 'webkitTransitionEnd transitionend MSTransitionEnd', callback

		transitionIn: (callback) -> 
			$('.caviar-stage').toggleClass('caviar-transition-in');
			$('.caviar-ui-controler-instance.next').one ANIMATIONS_EVENTS, (e) -> 
				$this = $(this)
				$currentActive = $('.caviar-ui-controler-instance.active')
				$currentActive.removeClass('caviar-active').addClass('caviar-backgrounded')
				$this.addClass('caviar-keep').removeClass('caviar-next').addClass('caviar-active').removeClass('caviar-keep')
				$stage.removeClass('caviar-transition-in')
				callback()


		transitionOut: (callback) -> 
			$('.caviar-backgrounded').toggleClass('caviar-backgrounded caviar-prev');
			$('.caviar-stage').addClass('caviar-transition-out');
			$('.caviar-ui-controler-instance.caviar-prev').one animationsEvents,  (e) ->
				$this = $(this)
				$currentActive = $('.caviar-ui-controler-instance.active')
				$currentActive.removeClass('caviar-active').addClass('caviar-dead')
				$this.addClass('caviar-keep').removeClass('caviar-prev').addClass('caviar-active').removeClass('caviar-keep')
				$stage.removeClass('caviar-transition-out')
				callback()

		transitionNone: (callback) ->
			$('.caviar-ui-controler-instance.caviar-next').toggleClass('caviar-next caviar-active');
			callback()