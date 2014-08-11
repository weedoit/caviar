/**
 * Execute steps to start the application
 * @module Caviar.Bootstrap
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Bootstrap', ['Caviar', 'IntentManager', 'Intent', 'Menu'], function(Caviar, IntentManager, Intent, Menu) {
	var Bootstrap;

	return Bootstrap = {
		/**
		 * Bootup application
		 */
		bootup: function() {
			this.initializeMenus();
			IntentManager.bindIntentElements();
			return IntentManager.start(new Intent('main'));
		},

		/**
		 * Setup sidebar menus
		 */
		initializeMenus: function() {
			return Menu.create({
				element: $('.snap-content')[0], 
				disable: 'right', 
				transitionSpeed: 0.1
			});
		}
	};
});