define 'Caviar', () ->
	globals = {}

	Caviar =
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

		contentBox: $('.caviar-stage-container').eq 0

		###*
		 * Implements a extends utils
		 * @param {Mixed} superclass Object or function that will be extended
		 * @param {Mixed} def Object or function with override implementation
		 * @return {Function}
		 *###
		extend: (parent, child) ->
			_hasProp = {}.hasOwnProperty
			_p = if @isFunction(parent) then new parent() else parent
			_c = if @isFunction(child) then new child() else child

			extended = () ->
			ctor = () ->

			ctor.prototype = _p			

			for key of _c
				if _hasProp.call(_c, key)
					ctor.prototype[key] = _c[key]

			extended.prototype = new ctor()
			return extended

		isFunction: (arg) ->
			typeof arg == 'function'
