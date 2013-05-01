/**
 * Carrito de la compra. Contiene una lista de ítems
 * de carrito.
 */
alibel.models.ShoppingCart = Backbone.Model.extend({
    defaults: {
        items: new alibel.collections.ItemCart(),
        date: new Date()
    },

    initialize: function () {
        // Activa la comprobación de errores
        this.on('invalid', this.throwError, this);
        var error = this.validate(this.attributes);
        if (typeof error !== 'undefined') {
            this.trigger('invalid', this, error);
        }

        // Propaga los eventos de la colección de ítems
        this.get('items')
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
        } else if (!(attrs.items instanceof alibel.collections.ItemCart)) {
            return 'Invalid item collection';
        }
    },

    /**
     * Calcula el valor del carrito
     * @return {number} Precio total del carrito
     */
    getTotal: function () {
        var result = 0;
        this.get('items').each(function (item) {
            result += item.getPrice() * item.get('quantity');
        });
        return result;
    },

    /**
     * Añade un item al carrito.
     * Este método no es más que un filtro que permite
     * añadir ítems sin tener que acceder al atributo 'items' o
     * pasando un item corriente
     * @param {alibel.models.Item || alibel.models.ItemCart} item Item de carrito o normal
     * @param {number} quantity Cantidad a añadir (se usará si el ítem pasado no es de carrito)
     * @param {number} price Precio del item (ídem)
     * @return {this} Se devuelve a sí mismo
     */
    add: function (item, quantity, price) {
        // Si es un item normal, creamos el item de carrito
        if (item instanceof alibel.models.Item) {
            var itemCart = new alibel.models.ItemCart({
                item: item,
                quantity: quantity,
                price: (typeof price === 'number') ? price : -1
            });
        } else {
            var itemCart = item;
        }

        // Comprobamos que las unidades son correctas
        if (itemCart.get('quantity') > itemCart.get('item').get('stock')) {
            throw alibel.error('Insuficient stock', 'alibel.models.ShoppingCart.add');
        }

        // No es un item de carrito... ¡error!
        if (!itemCart instanceof alibel.models.ItemCart) {
            throw new alibel.error('Incorrect item type', 'alibel.models.ShoppingCart.add()');
        }

        // Si el item ya esta en el carrito
        // sumamos unidades
        var existingItems = this.get('items').filter(function (_itemCart) {
                return _itemCart.get('item').get('code') ===
                        itemCart.get('item').get('code');
            });

        if (existingItems.length > 0) {
            existingItems[0].set('quantity',
                existingItems[0].get('quantity') +
                itemCart.get('quantity'));
        } else {
            this.get('items').add(itemCart);
        }

        // Finalmente restamos el stock añadido
        itemCart.get('item').set('stock',
            itemCart.get('item').get('stock') - itemCart.get('quantity'));

        return this;
    }
});
