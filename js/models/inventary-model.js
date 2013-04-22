/**
 * Guarda todos los items disponibles en la tienda
 * @see js/collections/item-collection.js
 * @type {Backbone.Model}
 */
window.alibelTPV.models.Inventary = Backbone.Model.extend({

	defaults: {
		items: new window.alibelTPV.collections.Item()
	},
    
    /**
     * Carga los items desde un fichero JSON y los añade al inventario.
     * @param {Object} data Resultado de la carga del fichero JSON.
     */
    fromJSON: function (data) {
        if (data.content.length !== parseInt(data.total)) {
            throw new Error("Corrupted JSON file. Please check your data");
        }
        
        var finalItem;
        
        // Itera en cada item y lo procesa
        _.each(data.content, function (item) {
            finalItem = {
                code: item.code,
                name: item.name,
                price: parseFloat(item.price),
                unit: item.unit,
                units: item.unit + 's',
                stock: parseInt(item.stock),
                minStock: parseInt(item.minStock)
            };
            
            window.alibelTPV.main.inventary.get('items').add(finalItem);
        });
    }
});
