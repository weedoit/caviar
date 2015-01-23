/**
 * Add some utils CSS classes to facilitate work with header bars
 * @module Caviar.HeaderBar
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('HeaderBar', function (DependParam) {
	var HeaderBar, onResizeHandler, bindWindowResize, injectStyle, NAVBAR_HEIGHT, $body, injectedStyles;

	/**
	 * Header bar height
	 * @type {Number}
	 */
	NAVBAR_HEIGHT = 50;

	/**
	 * jQuery body object cache
	 * @type {Object}
	 */
	$body = $('body');

	/**
	 * Status from inject styles
	 * @type {Object}
	 */
	injectedStyles = {
		portrait: false,
		landscape: false
	};

	/**
	 * On window resize event handler
	 * @param  {Object} e Event data
	 * @return void
	 */
	onResizeHandler = function (e) {
		var viewPortWidth, viewPortHeight, orientation;

		viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		orientation = (viewPortWidth > viewPortHeight) ? 'landscape' : 'portrait';

		// Some devices has different sizes when alternate orientation
		if (injectedStyles[orientation] === false) {
			injectStyle(orientation);
		}

		$body.removeClass('portrait').removeClass('landscape').addClass(orientation);
	};

	/**
	 * Bind window resize event
	 * @return void
	 */
	bindWindowResize = function () {
		$(window).resize(onResizeHandler);
	};

	/**
	 * Inject a style tag to fix content height
	 * @param  {String} orientation Current device orientation
	 * @return void
	 */
	injectStyle = function (orientation) {
		var viewPortHeight, rule;
		
		viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		injectedStyles[orientation] = true;

		rule = [
			'<style> .',
				orientation + ' .caviar-layout.has-header-bar section.content {',
					'overflow-y: auto;', 
					'width:100%;', 
					'height:',(viewPortHeight - NAVBAR_HEIGHT) + 'px;',
				'}',
			'</style>'
		];

		$body.append(rule.join(''));
	};


	// Exports
	return HeaderBar = {
		/**
		 * Initilize module.
		 * @return void
		 */
		init: function () {
			injectStyle();
			onResizeHandler();
			bindWindowResize();
		}
	};
});
