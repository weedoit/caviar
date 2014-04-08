define('SFG.ControllersInstanceManager', function () {
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
			colletion[sequence] = new ControllerClass();
			return sequence;
		});
	};

	ControllersInstanceManager.destroy = function (key) {
		delete colletion[key];
	};

	return ControllersInstanceManager;	
});