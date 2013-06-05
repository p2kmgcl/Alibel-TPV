/**
 * Conjunto de carritos de la compra
 * representa un historial de compras que se han hecho
 */
alibel.collections.ShoppingCart = Backbone.Collection.extend({
    model: alibel.models.ShoppingCart,

    /**
     * Devuelve los carritos que se encuentran
     * entre las dos fechas pasadas (ambas incluídas).
     * Si no se especifica el parámetro to, se usará
     * la fecha actual
     * @param {Date} from Fecha de inicio
     * @param {Date} to Fecha de fin
     * @return {alibel.models.ShoppingCart[]} Conjunto de carritos en esas fechas
     */
    filterByDate: function (from, to) {
        to = (to instanceof Date) ? to : new Date();

        return this.filter(function (sCart) {
            return (sCart.get('date') <= to &&
                     sCart.get('date') >= from);
        });
    },

    /**
     * Añade una lista de carritos un objeto JSON
     * @param {Object} data Datos que se van a procesar
     * @param {alibel.collections.Item} itemCollection Colección de
     *  ítems de la que se sacará la información necesaria.
     * return {this}
     */
    addFromJSON: function (data, itemCollection) {
        var cartItems,
            item,
            cartItem
            me = this;

        // Recorre todos los carritos para crearlos
        _.each(data.sells, function (sCart) {
            
            // Recorre los items de cada carrito
            cartItems = [];
            _.each(sCart.items, function (sCartItem) {

                // Busca el item en el inventario
                item = itemCollection.where({ code: sCartItem.code });
                if (item.length > 0) {
                    
                    // Si existe, crea el item de carrito. Sólo
                    // lo añade si está correctamente validado
                    try {
                        cartItem = new alibel.models.ItemCart({
                            item: item[0],
                            quantity: sCartItem.quantity,
                            price: (typeof sCartItem.price === 'number') ?
                                sCartItem.price : -1
                        });

                        cartItems.push(cartItem);
                    } catch(e) {
                        throw e;
                    }
                }
            });

            // Si se ha añadido algún ítem, creamos el carrito
            if (cartItems.length > 0) {
                me.add({
                    date: new Date(sCart.date),
                    collection: new alibel.collections.ItemCart(cartItems)
                });
            }
        });
        return this;
    }
});
