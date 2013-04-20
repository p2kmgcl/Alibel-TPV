/**
 * Guarda todos los items disponibles en la tienda
 * @see js/collections/item-collection.js
 * @type {Backbone.Model}
 */
window.alibelTPV.models.Inventary = Backbone.Model.extend({

	defaults: {
		items: new window.alibelTPV.collections.Item()
	}
});
