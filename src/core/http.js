/**
 * XHR module
 * @todo Implements methods get and post without uses jQuery
 * @module Caviar.ControllersInstanceManager
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('HTTP', function() {
	return {
		/**
		 * Alias to jQuery $.get
		 * @type {Function}
		 */
		get: $.get,

		/**
		 * Alias to jQuery $.post
		 * @type {Function}
		 */
		post: $.post
	}
});