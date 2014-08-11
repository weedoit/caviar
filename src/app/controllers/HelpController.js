define('HelpController', ['Caviar', 'Controller'], function (Caviar, Controller) {
	return Caviar.extend(Controller, {
		initialize: function () {
			this.set('title', '');
			this.set('description', '');
		}
	});
});