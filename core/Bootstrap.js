/**
 * Execute steps to start the application
 * @module Caviar.Bootstrap
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Bootstrap', ['Caviar', 'IntentManager', 'Intent', 'Menu', 'HeaderBar'], function (Caviar, IntentManager, Intent, Menu, HeaderBar) {
	var Bootstrap;

	return Bootstrap = {
		/**
		 * Bootup application
		 */
		bootup: function () {
			this.initializeMenus();
			this.configVue();
			IntentManager.bindIntentElements();
			HeaderBar.init();
			return IntentManager.start(new Intent('main'));
		},

		/**
		 * Setup sidebar menus
		 */
		initializeMenus: function () {
			return Menu.create({
				element: $('.snap-content')[0], 
				disable: 'right', 
				transitionSpeed: 0.2
			});
		},

		/**
		 * Setup Vue.js
		 */
		configVue: function () {
			return Vue.config({
			    prefix: 'c'
			});
		}
	};
});