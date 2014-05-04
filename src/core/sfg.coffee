define 'SFG', () ->
	globals = {}

	SFG =
		globals:
			###*
			 * Get a variable of application global scope
			 * @param {String} key
			 *###
			get: (key) ->
				return globals[key] || null

			###*
			 * Add/update a application global scope variable
			 * @param {String} key
			 * @param {Mixed} value
			 *###
			set: (key, value) ->
				globals[key] = value

		contentBox: $('#content')

		###*
		 * Implements a extends utils
		 * @param {Mixed} superclass Object or function that will be extended
		 * @param {Mixed} def Object or function with override implementation
		 * @return {Function}
		 *###
		extend: (superclass, def) ->
			hasProp = {}.hasOwnProperty
			parent = () ->
			child = if typeof def == 'function' then new def() else def
			extended = () ->

			parent.prototype = if typeof superclass == 'function' then new superclass() else superclass;
			extended.prototype = new parent();

			for key in child
				extended.prototype[key] = child[key] if hasProp.call(child, key)

			extended;
