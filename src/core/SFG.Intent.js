define('SFG.Intent', function () {
	var Intent;

	/**
	 * Constructor
	 * @param {Object} element DOM Element that calls a intent
	 */
	Intent = function (element) {
		if (typeof element !== 'undefined') {
			if (typeof element === 'string') {
				this.parseControllerAndActionsName(element);
			} else if (typeof element === 'object') {
				this.parseIntentElement(element);
				this.caller = element;
			}
		}
	};

	/**
	 * Controller that will be called
	 * @type {string}
	 */
	Intent.prototype.controller = null;

	Intent.prototype.controllerInstanceId = null;	

	/**
	 * When not null will calls a action from current instance controller 
	 * @type {string}
	 */
	Intent.prototype.action = 'main';

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
			intentData = $element.data('intent-data') || {},
			intentForResult = $element.data('intent-forResults') || false;

		this.data = intentData;
		this.forResult = intentForResult;
		this.parseControllerAndActionsName($element.data('intent'));
	};

	/**
	 * Parse controller name 
	 */
	Intent.prototype.parseControllerAndActionsName = function (intentPath) {
		var splits = intentPath.split('#');

		this.controller = splits[0].replace(/^([a-z])|_([a-z])/g, function ($1) {
			return $1.toUpperCase();
		}).replace(/(\s|_)/, '') + 'Controller';

		this.action = splits[1] || 'main';
	};

	return Intent;
});