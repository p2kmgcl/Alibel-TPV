/**
 * Vista de una lista de ítems
 * Contiene una colección de ítems en this.collection y
 * un array de vistas en this._views
 */
alibel.views.ShoppingCartCollection = Backbone.View.extend({
    tagName: 'ul',
    className: 'shoppingCartList',

    // Texto con el que se identifica a cada item para eliminarlo
    wrapperClass: 'shoppingCartWrapper',

    initialize: function () {
        this.views = {};

        // Genera las nuevas vistas en la colección
        // y crea los eventos de escucha para añadir/quitar
        // carritos
        this.collection
            .on('add', this.add, this)
            .on('remove', this.remove, this)
            .each(this.add, this);
    },

    /**
     * Genera una vista para el nuevo ítem
     * @param {alibel.models.Item} item Item para el que se
     * generará la vista
     */
    add: function (shoppingCart) {
        // Genera la vista del item añadido
        var newView = new alibel.views.ShoppingCart({
            model: shoppingCart
        });

        // Envuelve al item con un elemento li
        // por cuestión de semántica
        var $li = $(document.createElement('li'))
                    .addClass(this.wrapperClass)
                    .attr('data-id', shoppingCart.id)
                    .append(newView.el);

        // Añade la nueva vista a la lista de items
        this.views[shoppingCart.cid] = $li;
        this.$el.prepend($li);
        return this;
    },

    /**
     * Elimina un carrito de la lista de vistas y del DOM
     * @param  {alibel.models.ShoppingCart} sCart Carrito a eliminar
     * @return {alibel.views.ShoppingCartCollection}  Se devuelve a sí mismo
     */
    remove: function (sCart) {
        this.views[sCart.cid].remove();
        delete this.views[sCart.cid];
        return this;
    },

    /**
     * Filtra los carritos por su fecha.
     * Mostrará todos los resultados posibles
     * @param {Date} from Fecha de inicio
     * @param {Date} to Fecha de fin (si no se especifica es ahora)
     */
    filterByDate: function (from, to) {
        to = (to instanceof Date) ? to : new Date();

        var result = this.collection.filterByDate(from, to),
            // ítems a esconder (no forman parte del resultado)
            inverse = _.difference(this.collection.toArray(),
                                     result);

        // Muestra todos los ítems escondidos (por antiguas búsquedas)
        // y finalmente esconde los que no encajan en el resultado
        this.$el.find(' > li.hidden').removeClass('hidden');
        _.each(inverse, function (sCart) {
            this.views[sCart.cid].addClass('hidden');
        }, this);

        return this;
    }
});
