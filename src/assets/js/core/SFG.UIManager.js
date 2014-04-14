define('SFG.UIManager', ['SFG'], function (SFG) {
	var UIManager = {},
		MINZINDEX = 1,
		MAXZINDEX = 2;

	UIManager.actionTransition = function (controllerInstance, action, callback) {
		var view = controllerInstance.view,
			viewsActions = view.find('.action'),
			nextAction = this.getActionElement(view, action),
			transition = controllerInstance.transition,
			waitTransition = this.waitTransition,
			activedAction,
			_callback = callback || function () {};

		if (transition === null) {
			viewsActions.removeClass('actived-action');
			nextAction.addClass('actived-action');
			_callback();
		} else {
			activedAction = view.find('.action.actived-action');
			
			if (activedAction.length > 0) {

				waitTransition(view, function () {
					activedAction.removeClass('actived-action');
					nextAction.addClass('actived-action');
				
					waitTransition(nextAction, function () {
						_callback();
					});

					view.removeClass(transition);
				});

				view.addClass(transition);
			} else {
				nextAction.addClass('actived-action');
				_callback();
			}
		}
	};

	UIManager.controllerTransition = function (data, callback) {
		var prevView,
			nextView,

			nextIntent = data.next.intent,
			nextControllerInstance = data.next.controllerInstance,

			prevIntent = data.prev.intent,
			prevControllerInstance = data.prev.controllerInstance,

			_callback = callback || function () {},
			waitTransition = this.waitTransition;

		if (prevIntent === null) {
			nextView = nextControllerInstance.view;
			UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
			_callback();
			return;
		}

		prevView = prevControllerInstance.view;
		nextView = nextControllerInstance.view;

		if (nextIntent.forResult) {
			// Se o controller que esta saindo tiver uma animacao de transicao
			if (prevControllerInstance.transition !== null) {
				prevView.css('z-index', MAXZINDEX);
				nextView.css('z-index', MINZINDEX);

				if (nextControllerInstance.transition !== null) {
					waitTransition(prevView, function () {
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
						nextView.removeClass(nextControllerInstance.transition);
						_callback();
					});

					prevView.addClass(nextControllerInstance.transition);
				} else {
					waitTransition(prevView, function () {
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
						_callback();
					});
					prevView.addClass(nextControllerInstance.transition);
				}
			} else {
				prevView.css('z-index', MINZINDEX);
				nextView.css('z-index', MAXZINDEX);

				if (nextControllerInstance.transition !== null) {
					waitTransition(prevView, function () {
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
						nextView.removeClass(nextControllerInstance.transition);
					});

					nextView.addClass(prevControllerInstance.transition);
				} else {
					UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
					_callback();
					return;
				}
			}

		} else {
			prevView.css('z-index', MAXZINDEX);
			nextView.css('z-index', MINZINDEX);

			if (prevControllerInstance.transition !== null) {
				if (nextControllerInstance.transition !== null) {
					waitTransition(prevView, function () {
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
						nextView.removeClass(nextControllerInstance.transition);
						_callback();
					});

					prevView.addClass(prevControllerInstance.transition);
					nextView.addClass(nextControllerInstance.transition);
				} else {
					UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');

					waitTransition(prevView, function (e) {
						_callback();
					});

					prevView.addClass(prevControllerInstance.transition);
				}
			} else {
				if (nextControllerInstance.transition !== null) {
					waitTransition(prevView, function () {
						UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
						nextView.removeClass(nextControllerInstance.transition);
						_callback();
					});

					nextView.addClass(prevControllerInstance.transition);
				} else {
					prevView.find('.actived-action').removeClass('actived-action');
					UIManager.getActionElement(nextView, nextIntent.action).addClass('actived-action');
					_callback();
				}
			}
		}
	};

	UIManager.createViewElement = function (uid, layoutData) {
		var viewId = uid +  '_view',
			el = '<div id="' + viewId + '" class="controller_view"></div>',
			view;

		SFG.contentBox.append(el);
		view = $('#' + viewId);
		view.html(layoutData);

		return view;
	};

	UIManager.initializeLayout = function (view) {
		UIManager.addTransitionClassToElements(view);
	};

	UIManager.addTransitionClassToElements = function (view) {
		view.addClass('transition');
	};

	UIManager.waitTransition = function (element, callback) {
		element.one('webkitTransitionEnd transitionend MSTransitionEnd', callback);
	};

	UIManager.getActionElement = function (view, action) {
		return view.find('.action[data-action="' + action + '"]');
	};

	return UIManager;
});