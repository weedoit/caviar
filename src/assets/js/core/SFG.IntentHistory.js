define('SFG.IntentHistory', 
	['SFG.Intent'], 
	function (Intent) {
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

		IntentHistory.remove = function (intent) {
			var index = colletion.indexOf(intent);

			if (index > -1) {
				colletion.splice(index, 1);
			}
		};

		IntentHistory.removeLast = function () {
			return colletion.pop();
		};

		IntentHistory.all = function () {
			return colletion;
		};

		IntentHistory.clear = function () {
			colletion = [];
		};

		return IntentHistory;
	}
);