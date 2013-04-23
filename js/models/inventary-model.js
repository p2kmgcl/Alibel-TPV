/**
 * Guarda todos los items disponibles en la tienda
 * @see js/collections/item-collection.js
 * @type {Backbone.Model}
 */
window.alibelTPV.models.Inventary = Backbone.Model.extend({

	defaults: {
		items: new window.alibelTPV.collections.Item(),
        lastSold: []
	},
    
    /**
     * Carga los items desde un fichero JSON y los añade al inventario.
     * @param {Object} data Resultado de la carga del fichero JSON.
     */
    fromJSON: function (data) {
        var finalItem;
        
        // Itera en cada item y lo procesa
        _.each(data.items, function (item) {
            finalItem = {
                code: item.code,
                name: item.name,
                price: parseFloat(item.price),
                unit: item.unit,
                units: item.unit + 's',
                stock: parseInt(Math.random() * 10), //parseInt(item.stock)
                minStock: parseInt(item.minStock)
            };
            
            window.alibelTPV.main.inventary.get('items').add(finalItem);
        });
        
        // Almacena los últimos ítems vendidos
        _.each(data.lastSold, function (code) {
           window.alibelTPV.main.inventary.get('lastSold').push(code); 
        });
    },
    
    /**
     * Obtiene un item por su código
     * @param {string} code Código del ítem que se quiere obtener
     */
    getItemByCode: function (code) {
        return this.get('items').filter(function (item) {
            return item.get('code') === code;
        });
    },
    
    /**
     * Obtiene el item por su nombre o una subcadena de éste.
     * @param {string} name Nombre o subcadena del nombre
     */
    getItemByName: function (name) {
        return this.get('items').filter(function (item) {
            return (item.get('name').indexOf(name) !== -1);
        });
    }
});
