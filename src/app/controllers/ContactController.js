define('ContactController', ['Caviar', 'Controller'], function (Caviar, Controller) {
	return Caviar.extend(Controller, {

		initialize: function (intent) {
			var self = this;

			self.set('contatos', [
				{name: 'Bruno'},
				{name: 'Carlos'},
				{name: 'Victor'},
				{name: 'Guga'}
			]);
		}

	});
});