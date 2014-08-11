define('MainController', ['Caviar', 'Controller'], function (Caviar, Controller) {
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