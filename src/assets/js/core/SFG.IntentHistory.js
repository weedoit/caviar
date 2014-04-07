define('SFG.IntentHistory', ['SFG.Intent'], function (Intent) {
	var colletion = [],
		IntentHistory = {}; 

	IntentHistory.add = function (intent) {
		return colletion.push(intent);
	};

	IntentHistory.getCurrent = function () {
		return colletion[colletion.length - 1] || null;
	};

	IntentHistory.getPrev = function () {
		return colletion[colletion.length - 2] || null;
	};

	IntentHistory.removeLast = function () {
		return colletion.pop();
	};

	IntentHistory.clear = function () {
		colletion = [];
	};

	return IntentHistory;
});