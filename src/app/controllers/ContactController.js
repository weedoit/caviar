define('ContactController', ['Caviar', 'Controller'], function (Caviar, Controller) {
	return Caviar.extend(Controller, {

		initialize: function (intent) {
			var self = this;

			//navigator.contacts.read(function (lista) {

				var lista = [
					{name: 'Bruno'},
					{name: 'Carlos'},
					{name: 'Victor'},
					{name: 'Guga'}
				]

				self.data.contatos = lista;

			//});
		}

	});
});