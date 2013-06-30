/**
 * Carrito de la compra. Contiene una lista de ítems
 * de carrito.
 */
alibel.models.ShoppingCart = Backbone.Model.extend({
    // No puede haber dos compras en el mismo instante de tiempo
    // (hay precisión hasta de milisegundos).
    idAttribute: 'date',

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
            .on('remove', function (item) { this.trigger('change', item); }, this)
            .on('change', function (item) { this.trigger('change', item); }, this);
    },

    /**
     * Lanza el error pasado para que sea tratado externamente.
     * @param  {alibel.models.ShoppingCart} model Carrito de la compra
     * @param  {string} error Error ocurrido
     * @param {string} type Tipo de error
     * @return {alibel.models.Item} a sí mismo
     */
    throwError: function (model, error, type) {
        throw new alibel.error(error, 'alibel.models.ShoppingCart', type);
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
            throw alibel.error('Invalid item', 'alibel.models.ShoppingCart.add', 'invalidItem');
        }

        var itemCart = new alibel.models.ItemCart({
            item: item,
            quantity: quantity,
            price: (typeof price === 'number') ? price : -1
        });

        // Comprobamos que las unidades son correctas
        if (itemCart.get('quantity') > itemCart.getI('stock')) {
            throw alibel.error('Insuficient stock ('
                + itemCart.get('quantity') + ' > '
                + itemCart.getI('stock') + ')', 'alibel.models.ShoppingCart.add', 'notEnoughStock');
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
    },

    /**
     * Eliminar un item del carrito.
     * @param {alibel.models.Item} item Item de inventario
     * @param {number} quantity Cantidad a eliminar
     * @return {this} Se devuelve a sí mismo
     */
    remove: function (item, quantity) {
        // Si es un item normal, creamos el item de carrito
        if (!(item instanceof alibel.models.Item)) {
            throw alibel.error('Invalid item', 'alibel.models.ShoppingCart.add');
        }

        // Comprobamos si el item ya está en el carrito
        var itemCart = this.collection.filter(function (_itemCart) {
                return _itemCart.getI('code') === item.get('code');
            })[0];

        // Restamos la cantidad necesaria
        if (itemCart) {
            itemCart.set('quantity', itemCart.get('quantity') - quantity);
            item.set('stock', item.get('stock') + quantity);
        
            // Si la cantidad se ha quedado en 0, lo eliminamos
            if (itemCart.get('quantity') == 0) {
                this.collection.remove(itemCart);
            }
        }

        return this;
    }
});
