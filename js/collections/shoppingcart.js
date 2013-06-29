/**
 * Conjunto de carritos de la compra
 * representa un historial de compras que se han hecho
 */
alibel.collections.ShoppingCart = Backbone.Collection.extend({
    model: alibel.models.ShoppingCart,

    /**
     * Comparador de carritos
     */
    comparator: function (cartA, cartB) {
        var dateA = cartA.get('date'),
            dateB = cartB.get('date');

        if (dateA > dateB) {
            return 1;
        } else if (dateA < dateB) {
            return -1;
        }
        return 0;
    },

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
     * @param {Function} callback Función que se ejecutará cuando esté listo.
     * return {this}
     */
	addFromJSON: function (data, itemCollection, callback) {
        var cartItems,
            item,
            cartItem,
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
        
        if (typeof callback == 'function') {
            callback(this);
        }
        return this;
    },

    /**
     * Genera carritos aleatorios (usar para pruebas)
     * @param {alibel.collections.Item} itemCollection Lista de items que se pueden usar
     * @param {function} callback Función que se ejecutará cuando se termine
     */
    generateRandomCarts: function (itemCollection, callback) {
        var nItems = 0, //< Número de items que tendrá la compra
            cartItems = [], //< Carrito aleatorio generado
            item = null, // Item de inventario que se usará

            now = new Date(), //< Fecha actual
            date = null, //< Fecha de la compra
            maxDate = parseInt(Math.random() * 1000*60*60*24*7); // Máximo desfase de la compra

        for (var i = 0; i < 50; i++) {
            nItems = parseInt(Math.random() * 5 + 10);
            cartItems = [];
            date = parseInt(Math.random() * maxDate);

            for (var j = 0; j < nItems; j++) {
                item = itemCollection.at(parseInt(
                    Math.random() * itemCollection.length
                ));

                cartItems.push(new alibel.models.ItemCart({
                    item: item,
                    price: -1,
                    quantity: parseInt(Math.random() * 30 + 1)
                }));
            }

            this.add({
                date: new Date(now.getTime() - date),
                collection: new alibel.collections.ItemCart(cartItems)
            });
        }
        this.sort();

        if (typeof callback == 'function') {
            callback(this);
        }
        return this;
    }
});
