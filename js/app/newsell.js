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
        'keyup #newSellItemSearch':         'searchItem',
        'submit form':                      'preventSubmitEvent',

        'click #newSellComplete':           'completeSell',
        'click #newSellCancel':             'cancelSell',

        'click > .itemList':                'itemClickHandler',
        'click > .shoppingCart > .itemList':'itemClickHandler'
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
        (function () {
            // Se reutiliza en el método completeSell
            me.droppableConfig = {
                activeClass: 'ui-dragging',
                drop: function (event, ui) {
                    var code = parseInt(ui.draggable.find('>.code').html());
                    me._editingItem = me._getItem(code);
                    me.addToCart();
                }
            };

            me.$shoppingCart.$el.droppable(me.droppableConfig);
            me.$itemCollection.on('add', me.itemDragging, me);
            for (var code in me.$itemCollection.views) {
                me.itemDragging(me.$itemCollection.views[code]);
            }
        }());

        // Prepara lo diálogos para añadir/quitar items
        // Ver código en render
        this.itemCartDialogTemplate = _.template(alibel.templates.ItemCartDialog);
        this.itemCartDialog = document.createElement('form');

        // Variable interna que se usará para gestionar un item
        // que está siendo añadido/quitado
        this._editingItem = null;

        this.render();
        return this;
    },

    /**
     * Obtiene un item por su código.
     * Se ha creado este atajo por las repetidas veces
     * que se llama al método where en este módulo.
     * @param  {Item || Number} item Código del item o item (para buscar en el carrito)
     * @param {Boolean} cart Si se especifica, se busca en el carrito
     * @return {Item || undefined} Item encontrado
     */
    _getItem: function (item, cart) {
        var item = (typeof item == 'number') ?
                        this.itemCollection.where({
                            code: item
                        })[0]
                    : item;

        if (item && cart) {
            return this.shoppingCart.collection.where({
                item: item 
            })[0]; 
        }
        return item;
    },


    render: function () {
        var $newSellEnd = this.$el.html(this.template())
                            .find('> .newSellEnd');

        this.$shoppingCart.$el.insertBefore($newSellEnd);
        this.$itemCollection.$el.insertBefore($newSellEnd);

        // Añade los dialogos de edicion de items
        // Ver código en initialize
        var me = this;
        (function () {
            me.$el.append(me.itemCartDialog);
            me.$itemCartDialog = $(me.itemCartDialog).dialog({
                autoOpen: false,
                buttons: [
                    {
                        text: 'Aceptar',
                        // Pasa lo mismo que al pulsar ENTER
                        click: function (event) {
                            $(this).trigger($.Event('keyup', {
                                which: $.ui.keyCode.ENTER
                            }));
                        }
                    },
                    {   
                        text: 'Cancelar',
                        click: function () { $(this).dialog('close'); }
                    }
                ],
                modal: true,
                draggable: false,
                resizable: false,
                width: 640,
                height: 480,
                title: 'Añadiendo/quitando item',

                // Al terminar de trabajar con un item,
                // reenfocamos la barra de búsqueda
                close: function () {
                    this._editingItem = null;
                    this._editingCartItem = null;
                    // Reenfocamos la barra de búsqueda
                    $('#newSellItemSearch').focus();
                }

            // Guardamos los cambios al pulsar enter
            }).on('keyup', function (event) {
                var $this = $(this),
                    item = me._editingItem,
                    eItem = me._editingCartItem,
                    quantity = parseInt($this.find('#itemCartDialogQuantity').val()),
                    price = parseFloat($this.find('#itemCartDialogPrice').val());

                if (event.which == $.ui.keyCode.ENTER) {                    
                    if (eItem) {
                        var difference = eItem.get('quantity') - quantity,
                            price = (eItem.getPrice() != price) ? price : undefined;

                        if (difference > 0) {
                            me.removeFromCart(difference);
                        } else if (difference < 0) {
                            me.addToCart(difference * -1, price);
                        }

                    } else if (quantity) {
                        me.addToCart(quantity, (price) ? price : undefined);
                    }
                    $this.dialog('close');
                }

                $this.find('#itemCartDialogFinalPrice').html(
                    parseFloat((quantity || 0) * (price || 0)).toFixed(2)
                );
            }).on('click', function () {
                var $this = $(this),
                    quantity = parseInt($this.find('#itemCartDialogQuantity').val()),
                    price = parseFloat($this.find('#itemCartDialogPrice').val());

                $this.find('#itemCartDialogFinalPrice').html(
                    parseFloat((quantity || 0) * (price || 0)).toFixed(2)
                );
            });
        }());

        // Guarda la lista de items del DOM para usarla
        // en el metodo searchItem
        this.$itemCollectionList =
            this.$el.find('> .itemList');
        return this;
    },

    /**
     * Abre un cuadro de diálogo que permite editar las
     * cantidades añadidas de un item en el carrito así como su precio
     * @return {this} A sí mismo
     */
    openCartDialog: function (item) {
        // Guardamos el item actual
        this._editingItem = item;

        if (!this._editingItem) {
            throw new alibel.error('Invalid item: ' + item,
                'alibel.app.NewSell.openCartDialog');
        }

        // Si esta en el carrito lo obtenemos
        this._editingCartItem = this._getItem(item, true);

        // Renderizamos la plantilla
        if (this._editingCartItem) {
            var quantity = this._editingCartItem.get('quantity'),
                price = this._editingCartItem.getPrice();
        } else {
            var quantity = 0,
                price = item.get('price');
        }

        this.$itemCartDialog.html(this.itemCartDialogTemplate({
            name: item.get('name'),
            price: price,
            quantity: quantity,
            maxQuantity: item.get('stock') + quantity
        }));

        // Finalmente mostramos el cuadro de diálogo
        this.$itemCartDialog.dialog('open');
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
            distance: 20,
            zIndex: 9999,

            helper: function () {
                var origin = $itemView.$el,
                    clone = origin.clone();

                clone
                    .addClass('ui-dragging')
                    .width(origin.width())
                    .height(origin.height())
                    .find('>.stock').remove();

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
     * Se ha hecho click en un item. Mostramos las
     * opciones
     * @return {this} A si mismo
     */
    itemClickHandler: function (event) {
        // Obtenemos el codigo del item
        var $evTarget = $(event.target),
            code = parseInt(
                    ($evTarget.hasClass('item')) ?
                      $evTarget.find('> .code').html():
                      $evTarget.parent().find('.code').html()
                   ),
            // Obtenemos el item asociado al codigo...
            item = this._getItem(code);

        if (!item) {
            throw new alibel.error('Invalid code ' + code,
                'alibel.app.NewSell.itemClickHandler');
        }
        this.openCartDialog(item);
        return this;
    },

    /**
     * Busca un item por su nombre o su código.
     * Este método reacciona ante el evento de tecleo en la barra de
     * búsqueda.
     */
    searchItem: function (event) {
        var ENTER_KEY = 13,
            $search = $('#newSellItemSearch');

        if ($search.is(":focus") && !this.$itemCartDialog.dialog('isOpen')) {
            // Si se pulsa la tecla enter,
            // añadimos el primer item de la lista
            // de resultados
            if (event.which === ENTER_KEY) {
                var firstResult =
                        $(this.$itemCollectionList
                        .find('> li')
                        .not('.hidden, .noStock')[0]);

                if (firstResult.length > 0) {
                    var firstResultCode = firstResult.find('.code').html();
                }

                if (typeof firstResultCode !== 'undefined') {
                    var item = this._getItem(parseInt(firstResultCode));
                    this.openCartDialog(item);
                }
            }
            this.$itemCollection.search($search.val());
        }
        return this;
    },

    /**
     * Evita que los formularios lleguen a enviarse
     */
    preventSubmitEvent: function (event) {
        event.preventDefault();
        return false;
    },

    /**
     * Añade un item al carrito de compra
     * @param {Number} quantity Cuantas unidades desean añadirse
     *  (una por defecto)
     */
    addToCart: function (quantity, price) {
        var quantity = (typeof quantity === 'number') ? quantity : 1;
        // Añadimos el item
        this.shoppingCart.add(this._editingItem, quantity, price);
        return this;
    },

    /**
     * Quita un item del carrito de compra
     * @param {Number} quantity Cuantas unidades desean quitarse (una por defecto)
     */
    removeFromCart: function (quantity) {
        var quantity = (typeof quantity === 'number') ? quantity : 1;
        // Quitamos el item
        this.shoppingCart.remove(this._editingItem, quantity);
        return this;
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
            this.$shoppingCart.render()
                .$el.droppable(me.droppableConfig);
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
