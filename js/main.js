/**
 * Objeto global con toda la configuración del proyecto
 * @type {Object}
 */
window.alibelTPV = {

	models: {
		Item: undefined,
		ItemCart: undefined,
		ShoppingCart: undefined,

		History: undefined,
		Inventary: undefined
	},

	collections: {
		Item: undefined,
		ItemCart: undefined,
		ShoppingCart: undefined
	},

	main: {
		Inventary: undefined,
		History: undefined
	},

	init: function () {
		window.alibelTPV.main.Inventary = new window.alibelTPV.models.Inventary();
		window.alibelTPV.main.History = new window.alibelTPV.models.History();
		window.alibelTPV = window.alibelTPV.main;
	}

};

$(window.alibelTPV.init);
