define('MainController', ['Caviar', 'Controller'], function (Caviar, Controller) {
	return Caviar.extend(Controller, {
		transition: 'djsajdijsaidjiaosjdioasji',

		initialize: function () {
			this.data.title = 'Main screen';
		}, 

		
		publicMethods: {
			foo: function (e) {

				e.$data.title = 'ContactController.js';


			}
		}
	});
});