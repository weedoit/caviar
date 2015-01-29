/**
 * Sidebar menus
 * @module Caviar.Menu
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Menu', function (Caviar) {
	var $doc, snapper;

	$doc = $(document);

	return {
		/**
		 * Create a menu instance
		 * @param  {Objete} options Snap.js options
		 * @return {void}
		 */
		create: function (options) {
			var opt = options || {element: $('.snap-content')[0]};
			snapper = new Snap(opt);
			return this.bindElements();
		},

		/**
		 * Bind controls menu elements
		 * @return {void}
		 */
		bindElements: function () {
			var self = this;

			$doc.on('tap', '.caviar-open-menu-left', function (e) {
				self.show('left');
				e.preventDefault();
			});

			$doc.on('tap', '.caviar-open-menu-right', function (e) {
				self.show('right');
				e.preventDefault();
			});

			$doc.on('tap', '.caviar-toggle-menu-left', function (e) {
				self.toggle('left');
				e.preventDefault();
			});

			$doc.on('tap', '.caviar-toggle-menu-right', function (e) {
				self.toggle('right');
				e.preventDefault();
			});

			$doc.on('tap', '.caviar-menu-close', function (e) {
				self.hide();
				e.preventDefault();
			});

			$doc.on('tap', '.intent', function (e) {
				self.hide();
				e.preventDefault();
			});

			document.addEventListener('backbutton', function () {
				self.hide();
			}, false);

			return;
		},

		/**
		 * Hide sidebar menu
		 * @return {void}
		 */
		hide: function () {
			if (typeof snapper !== 'undefined') {
				return snapper.close();
			}
		},

		/**
		 * Show sidebar menu
		 * @param  {String} side Side of menu (left, right)
		 * @return {void}
		 */
		show: function (side) {
			if (typeof snapper !== 'undefined') {
				return snapper.open(side);
			}
		},

		/**
		 * Toggle sidebar menu
		 * @param  {String} side Side of menu (left, right)
		 * @return {void}
		 */
		toggle: function (side) {
			if (typeof snapper !== 'undefined') {
				if (snapper.state().state === 'closed') {
					return this.show(side);
				} else {
					return this.hide();
				}
			}
		},

		/**
		 * Check if sidebar menu is opened
		 * @return {Boolean}
		 */
		isOpened: function () {
			if (typeof snapper !== 'undefined') {
				return snapper.state().state !== 'closed';
			} else {
				return false;
			}
		}
	};
});

