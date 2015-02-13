/**
 * Manage transitions and view elements
 * @module Caviar.UIManager
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('UIManager', ['Caviar', 'UITransitions'], function (Caviar, UITransitions) {
	var $stage, UIManager;
	
	$stage = $('.caviar-stage');
	
	return UIManager = {
		/**
		 * Create a view element for a controller
		 * @param  {String} uid        Controller instance id
		 * @param  {String} layoutData Layout content
		 * @return {String}            New view id
		 */
		createViewElement: function (uid, layoutData) {
			var el, viewId;
			viewId = uid + '_ci';
			el = "<div id='" + viewId + "' class='caviar-ui-controler-instance caviar-next'>" + layoutData + "</div>";
			Caviar.contentBox.append(el);
			return viewId;
		},

		/**
		 * Transition in between controllers
		 * @param  {Function} callback Transition end callback
		 * @return {void}
		 */
		transitionIn: function (activeIntent, nextIntent, callback) {
			var cb, currentView, nextView;

			cb = callback || function () {};
			currentView = activeIntent.getControllerInstance().getViewElement();
			nextView = nextIntent.getControllerInstance().getViewElement();
			
			UITransitions.transitionIn(currentView, nextView, nextIntent.transition, function () {
				cb();
			});
		},

		/**
		 * Transition out between controllers
		 * @param  {Function} callback Transition end callback
		 * @return {void}
		 */
		transitionOut: function (activeIntent, prevIntent, callback) {
			var cb, currentView, prevView;

			cb = callback || function () {};
			currentView = activeIntent.getControllerInstance().getViewElement();
			prevView = prevIntent.getControllerInstance().getViewElement();

			UITransitions.transitionOut(currentView, prevView, activeIntent.transition, function () {
				cb();
			});
		},

		/**
		 * Change controller without transition
		 * @param  {Function} callback
		 * @return {void}
		 */
		transitionNone: function (activeIntent, nextIntent, callback) {
			var cb;
			cb = callback || function () {};
			$('.caviar-ui-controler-instance.caviar-next').toggleClass('caviar-next caviar-active');
			return cb();
		}
	};
});
