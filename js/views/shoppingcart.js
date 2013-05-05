/**
 * Vista de una lista de ítems
 * Contiene una colección de ítems en this.collection y
 * un array de vistas en this._views
 */
alibel.views.ShoppingCart = Backbone.View.extend({
    tagName: 'div',
    className: 'shoppingCart',
    template: _.template(alibel.templates.ShoppingCart),

    // Texto con el que se identifica a cada item para eliminarlo
    wrapperClass: 'itemCartWrapper',

    initialize: function () {
        // Cuando cambie el carrito renderizamos
        this.model.on('change', this.render, this);
        this.render();
    },

    /**
     * Actualiza la información del carrito
     */
    render: function () {
        this.$el.html(
            this.template({
                date: this.model.get('date'),
                totalPrice: this.model.getTotal(),
                totalItems: this.model.get('items').length
            }));

        this.model.get('items').each(function (itemCart) {
            this.add(itemCart);
        }, this);
    },

    /**
     * Genera una vista para el nuevo ítem
     * @param {alibel.models.Item} item Item para el que se
     * generará la vista
     */
    add: function (itemCart) {
        // Genera la vista del item añadido
        var newView = new alibel.views.ItemCart({
            model: itemCart
        });

        // Envuelve al item con un elemento li
        // por cuestión de semántica
        var $li = $(document.createElement('li'))
                    .addClass(this.wrapperClass + itemCart.get('item').get('code'))
                    .append(newView.el);

        // Añade la nueva vista al DOM
        this.$el.find('> .itemList').append($li);
        return this;
    }
});
