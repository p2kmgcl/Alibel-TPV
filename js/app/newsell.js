/**
 * Vista para crear nuevas compras
 */
alibel.views.NewSell = Backbone.View.extend({
    tagName: 'section',
    className: 'sectionNewSell',
    template: _.template(alibel.templates.NewSell),

    events: {
        'keyup #newSellItemSearch':     'searchItem',
        'click #newSellComplete':       'completeSell',
        'click #newSellCancel':         'cancelSell'
    },

    initialize: function (params) {
        this.shoppingCart = new alibel.views.ShoppingCart({
            model: params.shoppingCart
        });
        
        this.itemCollection = new alibel.views.ItemCollection({
            collection: params.itemCollection
        });

        this.render();
    },

    render: function () {
        this.$el
            .html(this.template())
            .append(this.itemCollection.el)
            .append(this.shoppingCart.el);
    },

    /**
     * Busca un item por su nombre o su código.
     * Este método reacciona ante el evento de tecleo en la barra de
     * búsqueda.
     */
    searchItem: function () {
        this.itemCollection.search(
            $("#newSellItemSearch").val());
    },

    /**
     * Completa la compra y deja todo listo para una nueva.
     * @return {alibel.models.ShoppingCart} Devuelve el carrito
     * que se usará en la nueva compra
     */
    completeSell: function () {
        if (this.shoppingCart.model.items.length > 0) {
            this.shoppingCart.model = new alibel.models.ShoppingCart({
                collection: new alibel.collections.Item()
            });
            this.shoppingCart.model.set('date', new Date());
        }
        return this.shoppingCart.model;
    },

    /**
     * Cancela la compra deshaciendo todos los cambios
     * que se habían hecho.
     */
    cancelSell: function () {

        // Recupera todas las unidades, vacía el carrito y actualiza
        // la fecha de compra
        this.shoppingCart.model.items
            .each(function (itemCart) {
                itemCart.setI('stock',
                    itemCart.getI('stock') + itemCart.get('quantity'));
            });
        this.shoppingCart.model.items.reset();
        this.shoppingCart.model.set('date', new Date());
    }
});
