/**
 * Guarda el historial de compras de la tienda
 * @see js/collections/shoppingCart-collection.js
 * @type {Backbone.Model}
 */
window.alibelTPV.models.History = Backbone.Model.extend({

	defaults: {
		shoppingCarts: new window.alibelTPV.collections.ShoppingCart()
	}
});
