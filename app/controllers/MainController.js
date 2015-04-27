define('MainController', ['Caviar', 'Controller'], function (Caviar, Controller) {
	return Caviar.extend(Controller, {

		initialize: function () {

			this.view.sections.thumb.append('<br>');

		}
	});
});