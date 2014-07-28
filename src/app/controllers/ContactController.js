define('ContactController', ['Caviar', 'Controller'], function (Caviar, Controller) {
	return Caviar.extend(Controller, {
		initialize: function () {
			this.set('title', 'Contact screen');
		}
	});
});