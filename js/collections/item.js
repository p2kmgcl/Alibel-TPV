/**
 * Conjunto de ítems
 */
alibel.collections.Item = Backbone.Collection.extend({
    model: alibel.models.Item,

    initialize: function () {
        this.on('add', this.checkUnique, this);
        return this;
    },

    /**
     * Comprueba que los ítems añadidos
     * no tienen el código repetido
     * @param  {alibel.models.Item} item Item que se acaba de añadir
     * @return {this} Se devuelve a sí mismo
     */
    checkUnique: function (item) {
        // Si el item está repetido es un error
        if (this.filter(function (_item) {
            return (item.get('code') === _item.get('code'));
        }).length > 1) {
            this.remove(item);
            throw new alibel.error('There\'s already an item with code ' + item.get('code'),
                'alibel.models.Item');
        }

        return this;
    },

    /**
     * Carga los items desde un fichero JSON y los añade al inventario.
     * @param {Object} data Resultado de la carga del fichero JSON.
     * @param {Function} callback Función que se llama cuando la carga ha terminado
     */
    addFromJSON: function (JSONdata, callback) {
        var finalItems = [];
        
        // Itera en cada item y lo procesa
        _.each(JSONdata.items, function (item) {
            finalItems.push({
                code: parseInt(item.code),
                name: item.name,
                price: parseFloat(item.price),
                unit: item.unit,
                units: item.unit + ((item.unit == 'Unidad') ? 'es' : 's'),

                // Genera valores aleatorios para las unidades de ítems
                // usa valores grandes para poder contemplar todos los casos
                // que podrían darse
                stock: parseInt(Math.random() * 100),   // parseInt(item.stock)
                minStock: parseInt(Math.random() * 100) // parseInt(item.minStock)
            });
        });
        
        // Finalmente añade los ítems
        // a la colección
        this.add(finalItems);

        // Llama a la función pasada
        callback(this);
    },

    /**
     * Obtiene un item por su código o nombre
     * @param {string} key Código o nombre del ítem
     */
    search: function (key) {
        key = key.toString().toLowerCase();
        return this.filter(function (item) {
            return ((item.get('code').toString().toLowerCase().indexOf(key) !== -1) ||
                     (item.get('name').toString().toLowerCase().indexOf(key) !== -1));
        });
    }
});
