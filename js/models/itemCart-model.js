/**
 * Item almacenado en un carrito de compra.
 * Requiere un modelo Item
 * @type {Backbone.Model}
 */
alibel.models.ItemCart = Backbone.Model.extend({
	defaults: {
		item: null,
		quantity: 0,
		price: -1
	}
});
