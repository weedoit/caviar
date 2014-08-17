/**
 * Stores started intents history
 * @module Caviar.IntentHistory
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('IntentHistory', ['Intent'], function (Intent) {
	var IntentHistory, colletion;
	colletion = [];

	return IntentHistory = {
		/**
		 * Add an intent in history
		 * @param {Intent} intent
		 */
		add: function (intent) {
			return colletion.push(intent);
		},

		/**
		 * Return current intent or null if not have intent started
		 * @return {Intent}
		 */
		getCurrent: function () {
			return colletion[colletion.length - 1] || null;
		},

		/**
		 * Return previous intent or null if not exists
		 * @return {Intent}
		 */
		getPrev: function () {
			return colletion[colletion.length - 2] || null;
		},

		/**
		 * Remove an intent from history
		 * @param {Intent} intent
		 */
		remove: function (intent) {
			var index;
			index = colletion.indexOf(intent);
			if (index > -1) {
				colletion.splice(index, 1);
			}
		},

		/**
		 * Remove last intent of history
		 * @return {Intent}
		 */
		removeLast: function () {
			return colletion.pop();
		},

		/**
		 * Returns full history
		 * @return {Array}
		 */
		all: function () {
			return colletion;
		},

		/**
		 * Returns history size
		 * @return {Number}
		 */
		count: function () {
			return colletion.length;
		},

		/**
		 * Clear intents history
		 * @return {Array}
		 */
		clear: function () {
			return colletion = [];
		},

		/**
		 * Clear intents history
		 * @return {Array}
		 */
		hasPrev: function () {
			return colletion.length > 1;
		}
	};
});
