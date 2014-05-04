define('MainController',
	['SFG', 'Controller', 'Intent', 'IntentManager'], 
	function (SFG, Controller, Intent, IntentManager) {
		return SFG.extend(Controller, {
			transition: null,

			main: function (e) {
				this.waitForResult(function (data) {
				});
			},

			timeline: function (intent) {
				var view = this.getViewByAction('timeline'),
					button = view.find('button');

				this.on('click', button, function () {
					intent.result({foo: 'Bar'});
				});
			}
		});
	}
);
