/**
 * Vista para crear nuevas compras
 */
alibel.app.NewSell = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionNewSell',
    template: _.template(alibel.templates.NewSell),

    events: {
        'keypress #newSellItemSearch':  'searchItem',
        'click #newSellComplete':       'completeSell',
        'click #newSellCancel':         'cancelSell',

        'click > .itemList':            'addToCart'
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

        this.$itemCollection =
            this.$el.find('> .itemList');
    },

    /**
     * Busca un item por su nombre o su código.
     * Este método reacciona ante el evento de tecleo en la barra de
     * búsqueda.
     */
    searchItem: function (event) {
        var ENTER_KEY = 13;

        // Si se pulsa la tecla enter,
        // añadimos el primer item de la lista
        // de resultados
        if (event.which === ENTER_KEY) {
            var firstResult =
                    $(this.$itemCollection
                    .find('> li')
                    .not('.hidden, .noStock')[0])
                        .find('.code')
                            .html();

            this.addToCart(event, parseInt(firstResult));
            return false;
        }

        this.itemCollection.search(
            $("#newSellItemSearch").val());
    },

    /**
     * Añade un item al carrito de compra
     * @param {Event} event Evento que origina esta llamada
     * @param {Number} code Se añadirá este ítem directamente
     *  directamente, se pasa este parámetro
     */
    addToCart: function (event, code) {
        // Si no se nos da un codigo lo obtenemos nosotros
        if (typeof code === 'undefined') {
            var $evTarget = $(event.target);

            code = parseInt(
                    ($evTarget.hasClass('item')) ?
                      $evTarget.find('> .code'):
                      $evTarget.parent().find('.code')
                      .html()
                   );
        }

        // Obtenemos el item asociado al codigo...
        var item = firstItem = this.itemCollection.collection.where({
            code: code
        })[0];

        if (typeof item === 'undefined') {
            throw new alibel.error('Invalid code ' + code,
                'alibel.app.NewSell.addToCart');
        }

        // Añadimos el item
        this.shoppingCart.model.add(item, 1);
        $('#newSellItemSearch').focus();
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
