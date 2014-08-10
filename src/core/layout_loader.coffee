define 'LayoutLoader', () ->
	Cache = {}

	LayoutLoader =
		load: (controllerName, callback) ->
			filename = controllerName.replace('Controller', '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
			this.getLayoutFile filename, callback

		getLayoutFile: (path, callback) ->
			path = "assets/layouts/#{path}.html"
			cached = Cache[path] || null
			
			return callback(cached) if cached != null

			$.get path, (data) ->
				Cache[path] = data
				callback(data)
