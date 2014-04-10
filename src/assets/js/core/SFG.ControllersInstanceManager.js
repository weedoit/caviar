define('SFG.ControllersInstanceManager', 'SFG', function (SFG) {
	var seq = 0,
		getSequence,
		colletion = {},
		ControllersInstanceManager = {};

	getSequence = function () {
		seq += 1;
		return 'uid' + seq;
	};

	ControllersInstanceManager.exists = function (key) {
		return (typeof colletion[key] !== 'undefined');
	};

	ControllersInstanceManager.get = function (key) {
		return colletion[key] || null;
	};

	ControllersInstanceManager.create = function (controllerName, callback) {
		var sequence = getSequence();

		require([controllerName], function (ControllerClass) {
			var instance = new ControllerClass();

			instance.name = controllerName;
			instance.loadResources(function (layoutData) {
				var viewId = sequence +  '_view';
					el = '<div id="' + viewId + '"></div>',
					view;

				SFG.contentBox.append(el);
				view = $(viewId);
				view.html(layoutData);
				instance.view = view;

				colletion[sequence] = instance;
				callback(sequence);
			});
		});
	};

	ControllersInstanceManager.destroy = function (key) {
		colletion[key].unloadResources();
		delete colletion[key];
	};

	return ControllersInstanceManager;	
});