define('SFG', function () {
	var SFG = {}, 
		globals = {};

	SFG.globals = {};

	/**
	 * Get a variable of application global scope
	 * @param  {String} key
	 */
	SFG.globals.get = function (key) {
		return globals[key] || null;
	};

	/**
	 * Add/update a application global scope variable
	 * @param {String} key
	 * @param {Mixed} value
	 */
	SFG.globals.set = function (key, value) {
		globals[key] = value;
	};

	/**
	 * Implements a extends utils
	 * @param  {Mixed}    superclass Object or function that will be extended
	 * @param  {Mixed} 	  def        Object or function with override implementation
	 * @return {Function}
	 */	
	SFG.extend = function(superclass, def){
		var hasProp = {}.hasOwnProperty,
			parent = function () {},
			child = (typeof def === 'function') ? new def() : def,
			extended = function () {};

		parent.prototype = (typeof superclass === 'function') ? new superclass() : superclass;
		extended.prototype = new parent();

		for (var key in child) { 
			if (hasProp.call(child, key)) {
				extended.prototype[key] = child[key];
			} 
		}

		return extended;
	};

	SFG.contentBox = $('#content');

	return SFG;
});