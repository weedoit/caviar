define('SFG.UIManager', function () {
	var UIManager = {};


	UIManager.actionTransition = function (view, action) {

	};

	UIManager.controllerTransition = function (view) {

	};

	UIManager.bindTransition = function (element, callback) {
		element.one('webkitTransitionEnd transitionend MSTransitionEnd', callback);
	};

	UIManager.getActionElement = function (view, action) {
		return view.find('.action[data-action="' + action + '"]');
	};

	return UIManager;
});