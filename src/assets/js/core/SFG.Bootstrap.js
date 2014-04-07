define('SFG.Bootstrap', ['SFG', 'SFG.IntentManager'], function (SFG, IntentManager) {
	var Bootstrap;

	Bootstrap = {};

	Bootstrap.bootup = function () {
		this.initializeMenus();

		IntentManager.bindIntentElements();
	};

	Bootstrap.initializeMenus = function (argument) {
		var options = {
				element: document.getElementById('stage'),
				dragger: null,
				disable: 'none',
				addBodyClasses: true,
				hyperextensible: true,
				resistance: 0.5,
				flickThreshold: 20,
				transitionSpeed: 0.3,
				easing: 'ease',
				maxPosition: 266,
				minPosition: -266,
				tapToClose: true,
				touchToDrag: true,
				slideIntent: 40,
				minDragDistance: 5
			};

		SFG.globals.set('snapper', new Snap(options));
	};

	return Bootstrap;
});