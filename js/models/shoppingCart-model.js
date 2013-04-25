/**
 * Carrito de la compra
 * @see js/collections/item-collection.js
 */
alibel.models.ShoppingCart = Backbone.Model.extend({

	defaults: {
		date: new Date(),
		items: new alibel.collections.ItemCart()
	}
});
