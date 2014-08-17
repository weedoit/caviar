/**
 * Manage transitions and view elements
 * @module Caviar.UIManager
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('UIManager', ['Caviar'], function (Caviar) {
	var $stage, ANIMATIONS_EVENTS, UIManager;
	
	$stage = $('.caviar-stage');
	ANIMATIONS_EVENTS = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
	
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
		transitionIn: function (callback) {
			var cb;
			cb = callback || function () {};
			$('.caviar-backgrounded').addClass('caviar-standby');
			$('.caviar-stage').toggleClass('caviar-transition-in');
			$('.caviar-ui-controler-instance.caviar-next').one(ANIMATIONS_EVENTS, function (e) {
				var $currentActive, $this;
				$this = $(this);
				$currentActive = $('.caviar-ui-controler-instance.caviar-active');
				$currentActive.removeClass('caviar-active').addClass('caviar-backgrounded');
				$this.addClass('caviar-keep').removeClass('caviar-next').addClass('caviar-active').removeClass('caviar-keep');
				$stage.removeClass('caviar-transition-in');
				return cb();
			});
		},

		/**
		 * Transition out between controllers
		 * @param  {Function} callback Transition end callback
		 * @return {void}
		 */
		transitionOut: function (callback) {
			var cb;
			cb = callback || function () {};
			$('.caviar-backgrounded').last().toggleClass('caviar-backgrounded caviar-prev');
			$('.caviar-standby').last().removeClass('caviar-standby');
			$('.caviar-stage').addClass('caviar-transition-out');
			$('.caviar-ui-controler-instance.caviar-prev').one(ANIMATIONS_EVENTS, function (e) {
				var $currentActive, $this;
				$this = $(this);
				$currentActive = $('.caviar-ui-controler-instance.caviar-active');
				$currentActive.removeClass('caviar-active').addClass('caviar-dead');
				$this.addClass('caviar-keep').removeClass('caviar-prev').addClass('caviar-active').removeClass('caviar-keep');
				$stage.removeClass('caviar-transition-out');
				return cb();
			});
		},

		/**
		 * Change controller without transition
		 * @param  {Function} callback
		 * @return {void}
		 */
		transitionNone: function (callback) {
			var cb;
			cb = callback || function () {};
			$('.caviar-ui-controler-instance.caviar-next').toggleClass('caviar-next caviar-active');
			return cb();
		}
	};
});
