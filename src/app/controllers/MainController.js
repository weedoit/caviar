define('MainController', ['Caviar', 'Controller', 'Intent', 'IntentManager'], function (Caviar, Controller, Intent, IntentManager) {
	return Caviar.extend(Controller, {

		initialize: function () {
			this.set('title', '');
			this.set('description', '');
		}, 

		
		publicMethods: {
			foo: function (e) {
				var i;

				i = new Intent('contact');
				i.data = e.$data;
				IntentManager.start(i);
			}
		}
	});
});