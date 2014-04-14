define('MainController', ['SFG', 'SFG.Controller'], function (SFG, Controller) {
	return SFG.extend(Controller, {
		transition: null,

		main: function (e) {
			console.log(e);
		},

		form: function (e) {
			console.log(e);
		},

		list: function (e) {
			console.log(e);
		}

	});
});