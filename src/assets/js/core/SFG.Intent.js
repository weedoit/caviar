define('SFG.Intent', function () {
	var Intent;

	/**
	 * Constructor
	 * @param {Object} element DOM Element that calls a intent
	 */
	Intent = function (element) {
		this.caller = element;

		if (typeof element !== 'undefined') {
			this.parseIntentElement(element);
		}
	};

	/**
	 * Controller that will be called
	 * @type {string}
	 */
	Intent.prototype.controller = null;

	/**
	 * When not null will calls a action from current instance controller 
	 * @type {string}
	 */
	Intent.prototype.action = null;

	/**
	 * Optional data to controller
	 * @type {Object}
	 */
	Intent.prototype.data = {};

	/**
	 * If true, returns data for previous screen instance
	 * @type {Boolean}
	 */
	Intent.prototype.forResult = false;

	Intent.prototype.resultHandler = function () {};

	Intent.prototype.result = function (data) {
		this.resultHandler(this, data);
	}

	/**
	 * Mount a intent from a element
	 * @param  {Object} element DOM Element that calls a intent
	 */
	Intent.prototype.parseIntentElement = function(element) {
		var $element = $(element),
			intentData = $element.data('intent-data') || {};

		this.data = intentData;
	};

	/**
	 * Parse controller name 
	 * @param  {Object} $element Zepto object from calller element
	 */
	Intent.prototype.parseControllerAndActionsName = function ($element) {
		var intent = $element.data('intent'),
			splits = intent.split('#');

		this.controller = splits[0].replace(/^([a-z])|_([a-z])/g, function ($1) {
			return $1.toUpperCase();
		}).replace(/\s/, '') + 'Controller';

		this.action = splits[1] || null;
	};

	return Intent;
});