/**
 * Carrito de la compra
 * @see js/collections/item-collection.js
 */
window.alibelTPV.models.ShoppingCart = Backbone.Model.extend({

	defaults: {
		date: new Date(),
		items: new window.alibelTPV.collections.ItemCart()
	}
});
