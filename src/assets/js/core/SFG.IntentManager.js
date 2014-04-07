define('SFG.IntentManager', ['SFG.Intent'], function (Intent) {
	var INDEX = 0,
		Historic = [],
		IntentManager = {}; 

	IntentManager.getIndex = function () {
		INDEX += 1;
		return INDEX;
	};

	IntentManager.bindIntentElements = function () {
		$doc = $(document);

		$doc.on('tap click', '.intent', function (e) {
			IntentManager.intentHandler(new Intent(this));
			window.location.hash = IntentManager.getIndex();
			e.preventDefault();
		});
	};

	IntentManager.intentHandler = function (intent) {



		console.log(intent);
	};

	IntentManager.setIntentResultHandler = function (intent) {
		intent.resultHandler = this.onResultHandler;
	};

	IntentManager.onResultHandler = function (intent, data) {

	};

	return IntentManager;
});