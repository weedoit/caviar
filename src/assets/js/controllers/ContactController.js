define('ContactController', ['SFG', 'SFG.Controller'], function (SFG, Controller) {
	return SFG.extend(Controller, {
		transition: null,

		main: function (e) {
			console.log(e);
		}
	});
});