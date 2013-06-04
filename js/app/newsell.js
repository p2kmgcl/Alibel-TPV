/**
 * Vista para crear nuevas compras
 *
 * @todo Al cancelar una compra, la lista de items de inventario
 *  no se actualiza.
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
        this.shoppingCart = params.shoppingCart;
        this.$shoppingCart = new alibel.views.ShoppingCart({
            model: this.shoppingCart
        });
        
        this.itemCollection = params.itemCollection;
        this.$itemCollection = new alibel.views.ItemCollection({
            collection: this.itemCollection
        });

        this.shoppingCartCollection = params.shoppingCartCollection;

        this.render();
    },

    render: function () {
        var $newSellEnd = this.$el.html(this.template())
                            .find('> .newSellEnd');
        this.$itemCollection.$el.insertBefore($newSellEnd);
        this.$shoppingCart.$el.insertBefore($newSellEnd);

        // Guarda la lista de items del DOM para usarla
        // en el metodo searchItem
        this.$itemCollectionList =
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
                    $(this.$itemCollectionList
                    .find('> li')
                    .not('.hidden, .noStock')[0]);

            if (firstResult.length > 0) {
                var firstResultCode = firstResult
                                        .find('.code')
                                        .html();
            }

            if (typeof firstResultCode !== 'undefined') {
                this.addToCart(event, parseInt(firstResultCode));
            }
            return false;
        }

        this.$itemCollection.search(
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
        var item = firstItem = this.itemCollection.where({
            code: code
        })[0];

        if (typeof item === 'undefined') {
            throw new alibel.error('Invalid code ' + code,
                'alibel.app.NewSell.addToCart');
        }

        // Añadimos el item
        this.shoppingCart.add(item, 1);
        $('#newSellItemSearch').focus();
    },

    /**
     * Completa la compra y deja todo listo para una nueva.
     * Añade la compra antigua a una lista de compras que tiene
     * guardada en this.shoppingCartCollection
     */
    completeSell: function () {
        if (this.shoppingCart.collection.length > 0) {
            // Añade la compra a la lista de compras
            this.shoppingCartCollection.add(this.shoppingCart.model);

            // Crea un nuevo modelo de carrito
            // y actualiza la vista asociada
            this.shoppingCart = new alibel.models.ShoppingCart({
                collection: new alibel.collections.ItemCart(),
                date: new Date()
            });
            
            this.$shoppingCart.render();
        }

    },

    /**
     * Cancela la compra deshaciendo todos los cambios
     * que se habían hecho.
     */
    cancelSell: function () {

        // Recupera todas las unidades, vacía el carrito y actualiza
        // la fecha de compra
        this.shoppingCart.collection
            .each(function (itemCart) {
                itemCart.setI('stock',
                    itemCart.getI('stock') + itemCart.get('quantity'));
            });
        this.shoppingCart.collection.reset();
        this.shoppingCart.set('date', new Date());
    }
});
