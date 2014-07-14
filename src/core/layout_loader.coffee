define 'LayoutLoader', () ->
	LayoutLoader =
		load: (controllerName, callback) ->
			filename = controllerName.replace('Controller', '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
			this.getLayoutFile filename, callback

		getLayoutFile: (path, callback) ->
			path = "assets/layouts/#{path}.html"
			$.get path, callback
