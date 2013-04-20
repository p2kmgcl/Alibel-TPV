/**
 * Contiene todos los datos de un item almacenado en el inventario
 * @type {Backbone.Model}
 */
window.alibelTPV.models.Item = Backbone.Model.extend({

	defaults: {
		code: '',
		name: '',
		price: '',
		stock: 0,
		minStock: 1,
		maxStock: Infinity
	}
});
