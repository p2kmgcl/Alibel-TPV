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

        // Guarda el historial de carritos para poder
        // completar una compra
        this.shoppingCartCollection = params.shoppingCartCollection;

        // Activa el drag & drop en los items
        var me = this;
        this.$shoppingCart.$el.droppable({
            drop: function (event, ui) {
                var code = parseInt(ui.draggable.find('>.code').html());
                me.addToCart(event, code); }
        });
        this.$itemCollection.on('add', this.itemDragging, this);

        this.render();
        return this;
    },

    render: function () {
        var $newSellEnd = this.$el.html(this.template())
                            .find('> .newSellEnd');
        this.$shoppingCart.$el.insertBefore($newSellEnd);
        this.$itemCollection.$el.insertBefore($newSellEnd);

        // Guarda la lista de items del DOM para usarla
        // en el metodo searchItem
        this.$itemCollectionList =
            this.$el.find('> .itemList');
        return this;
    },

    /**
     * Activa la posibilidad de arrastrar items
     * al carrito para añadirlos de uno en uno
     * @param  {alibel.Views.ItemView} $itemView
     */
    itemDragging: function ($itemView) {
        $itemView.$el.draggable({
            opacity: 0.9,
            revert: 'invalid',
            scroll: false,
            zIndex: 9999,

            helper: function () {
                var origin = $itemView.$el,
                    clone = origin.clone();

                clone
                    .width(origin.width() * 0.8)
                    .height(origin.height())
                    .find('>.stock').remove();
                
                console.dir(clone);
                return clone;
            },

            start: function (event, ui) {
                // Modifica el stock de forma ficticia
                // para que se vea que se ha quitado un item
                var $stock = $itemView.$el.find('>.stock')
                $stock.html(
                    ($itemView.model.get('stock') - 1) +
                    ' ' + ($stock.html().split(' ')[1])
                );
            },

            stop: function (event, ui) {
                // Restaura la cuenta de items
                $itemView.model.trigger('change', $itemView.model);
            }
        });
        return this;
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
        // Comprueba si hay algún ítem en la compra
        // en caso de que no haya no hacemos nada
        if (this.shoppingCart.collection.length > 0) {

            // Añade la compra a la lista de compras
            this.shoppingCartCollection.add({
                collection: this.shoppingCart.collection.clone(),
                date: this.shoppingCart.date
            });

            // Reinicia el carrito para la próxima
            // compra
            this.shoppingCart.set({
                collection: this.shoppingCart.get('collection').reset(),
                date: new Date()
            });
            
            // Actualiza la vista del carrito
            // y la deja preparada
            var me = this;
            this.$shoppingCart.render().$el.droppable({
                drop: function (event, ui) {
                    var code = parseInt(ui.draggable.find('>.code').html());
                    me.addToCart(event, code); }
            });
        }
        return this;
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
