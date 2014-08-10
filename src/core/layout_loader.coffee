define 'LayoutLoader', () ->
	Cache = {}

	LayoutLoader =
		load: (controllerName, callback) ->
			filename = controllerName.replace('Controller', '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
			this.getLayoutFile filename, callback

		getLayoutFile: (path, callback) ->
			# Windows Phone WebView path uses a protocol that confuses jQuery Ajax Implementation 
			isWP = (window.location.href.indexOf('x-wmapp0:') >= 0)
			path = if isWP then "x-wmapp0:www/assets/layouts/#{path}.html" else "assets/layouts/#{path}.html" 
			
			cached = Cache[path] || null

			return callback(cached) if cached != null

			xmlhttp = new XMLHttpRequest()
			xmlhttp.onreadystatechange = () ->
				if xmlhttp.readyState == 4 && xmlhttp.status == 200
					Cache[path] = xmlhttp.responseText;
					callback(xmlhttp.responseText);

			xmlhttp.open("GET", path, true);
			xmlhttp.send();