/**
 * Carrito de la compra. Contiene una lista de ítems
 * de carrito.
 */
alibel.models.ShoppingCart = Backbone.Model.extend({
    defaults: {
        collection: new alibel.collections.ItemCart(),
        date: new Date()
    },

    initialize: function () {
        // Activa la comprobación de errores
        this.on('invalid', this.throwError, this);
        var error = this.validate(this.attributes);
        if (typeof error !== 'undefined') {
            this.trigger('invalid', this, error);
        }

        // Acceso más práctico a los items
        this.collection = this.get('collection');
        // Propaga los eventos de la colección de ítems
        this.collection
            .on('add', function (item) { this.trigger('change', item); }, this)
            .on('remove', function (item) { this.trigger('change', item); }, this);
    },

    /**
     * Lanza el error pasado para que sea tratado externamente.
     * @param  {alibel.models.ShoppingCart} model [description]
     * @param  {string} error Error ocurrido
     * @return {alibel.models.Item} a sí mismo
     */
    throwError: function (model, error) {
        throw new alibel.error(error, 'alibel.models.ShoppingCart');
        return this;
    },

    /**
     * Comprueba que los atributos pasados al carrito cumplen todas las condiciones
     * establecidas.
     * @param {object} attrs Objeto con los atributos del carrito que van
     *  a comprobarse.
     */
    validate: function (attrs) {
        if (!(attrs.date instanceof Date)) {
            return 'Invalid date';
        } else if (!(attrs.collection instanceof alibel.collections.ItemCart)) {
            return 'Invalid item collection';
        }
    },

    /**
     * Calcula el valor del carrito
     * @return {number} Precio total del carrito
     */
    getTotal: function () {
        var result = 0;
        this.collection.each(function (itemCart) {
            result += itemCart.getPrice() * itemCart.get('quantity');
        });
        return result;
    },

    /**
     * Añade un item al carrito.
     * @param {alibel.models.Item} item Item de inventario
     * @param {number} quantity Cantidad a añadir (se usará si el ítem pasado no es de carrito)
     * @param {number} price Precio del item (ídem)
     * @return {this} Se devuelve a sí mismo
     */
    add: function (item, quantity, price) {
        // Si es un item normal, creamos el item de carrito
        if (!(item instanceof alibel.models.Item)) {
            throw alibel.error('Invalid item', 'alibel.models.ShoppingCart.add');
        }

        var itemCart = new alibel.models.ItemCart({
            item: item,
            quantity: quantity,
            price: (typeof price === 'number') ? price : -1
        });

        // Comprobamos que las unidades son correctas
        if (itemCart.get('quantity') > itemCart.getI('stock')) {
            throw alibel.error('Insuficient stock', 'alibel.models.ShoppingCart.add');
        }

        // Comprobamos si el item ya está en el carrito
        var existingItems = this.collection.filter(function (_itemCart) {
                return _itemCart.getI('code') === itemCart.getI('code');
            });

        // Si el item ya esta en el carrito sumamos unidades
        if (existingItems.length > 0) {
            existingItems[0].set('quantity',
                existingItems[0].get('quantity') +
                itemCart.get('quantity'),
            { validate: true });

            // Activamos el evento de cambio
            // manualmente para que se detecte el añadido
            this.trigger('change');

        // Si no añadimos el nuevo item
        } else {
            this.collection.add(itemCart);
        }

        // Finalmente restamos el stock añadido
        itemCart.setI('stock',
            itemCart.getI('stock') - itemCart.get('quantity'));

        return this;
    },

    /**
     * Añade una lista de carritos desde datos JSON
     * @param {Object} data Datos que se van a procesar
     * @param {alibel.collections.Item} itemCollection Colección de
     *  ítems de la que se sacará la información necesaria.
     * return {this}
     */
    addFromJSON: function (data, itemCollection) {
        this.collection.addFromJSON(data, itemCollection);
        return this;
    }
});
