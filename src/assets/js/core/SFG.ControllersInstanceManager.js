define('SFG.ControllersInstanceManager', ['SFG', 'SFG.UIManager'], function (SFG, UIManager) {
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
				var view;

				view = UIManager.createViewElement(sequence, layoutData);
				UIManager.initializeLayout(view);

				instance.view = view;
				colletion[sequence] = instance;
				callback(sequence);
			});
		});
	};

	ControllersInstanceManager.restore = function (controllerInstance, callback) {
		var sequence = getSequence();
		
		controllerInstance.loadResources(function (layoutData) {
			var view = UIManager.createViewElement(sequence, layoutData);
			UIManager.initializeLayout(view);
			controllerInstance.view = view;
			callback();
		});
	};

	ControllersInstanceManager.destroy = function (key) {
		colletion[key].unloadResources();
		delete colletion[key];
	};

	return ControllersInstanceManager;	
});