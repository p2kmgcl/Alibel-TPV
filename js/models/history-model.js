/**
 * Guarda el historial de compras de la tienda
 * @see js/collections/shoppingCart-collection.js
 * @type {Backbone.Model}
 */
alibel.models.History = Backbone.Model.extend({

	defaults: {
		shoppingCarts: new alibel.collections.ShoppingCart()
	}
});
