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
    }
});
