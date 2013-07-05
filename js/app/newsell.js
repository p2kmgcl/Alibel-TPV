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

        'click #newSellComplete':           'showCompleteDialog',
        'click #newSellCancel':             'showCancelDialog',

        'click > .itemList .item':          'itemClickHandler',
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
        this._activateDragAndDrop();

        // Prepara lo diálogos para añadir/quitar items
        // Ver código en render
        this.itemCartDialogTemplate = _.template(alibel.templates.ItemCartDialog);
        this.itemCartDialog = document.createElement('form');
        this.itemCartDialog.id = 'itemCartDialog';

        this.render();
        return this;
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
                        text: __('removeItem'),
                        // Ponemos la cantidad a cero
                        // y activamos el cambio de items
                        click: function (event) {
                            $(this)
                                .find('#itemCartDialogQuantity')
                                .val('0')
                                .end()
                            .trigger($.Event('keyup', {
                                which: $.ui.keyCode.ENTER
                            }));
                        }
                    },
                    {
                        text: __('accept'),
                        // Pasa lo mismo que al pulsar ENTER
                        click: function (event) {
                            $(this).trigger($.Event('keyup', {
                                which: $.ui.keyCode.ENTER
                            }));
                        }
                    },
                    {   
                        text: __('cancel'),
                        click: function () { $(this).dialog('close'); }
                    }
                ],
                modal: true,
                draggable: false,
                resizable: false,
                minWidth: 540,
                title: __('addingRemovingItem'),

                create: function () {
                    var $this = $(this),
                        $buttons =  $this.next(),
                        $remove = $buttons.find('button:first'),
                        $complete = $remove.next(),
                        $cancel =   $buttons.find('button:last');

                    $remove
                        .addClass('ui-state-highlight')
                        .find('>span')
                        .prepend('<i class="icon-trash"><i> ');

                    $complete
                        .addClass('ui-state-highlight')
                        .find('>span')
                        .prepend('<i class="icon-ok-sign"><i> ');
                    
                    $cancel
                        .addClass('ui-state-error')
                        .find('>span')
                        .prepend('<i class="icon-remove-sign"></i> ');
                },

                // Al terminar de trabajar con un item,
                // reenfocamos la barra de búsqueda
                close: function () {
                    me._editingItem = null;
                    me._editingCartItem = null;
                    // Reenfocamos la barra de búsqueda
                    me._cleanSearch();
                }

            // Guardamos los cambios al pulsar enter
            }).on('keyup', function (event) {
                var $this = $(this),
                    item = me._editingItem,
                    eItem = me._editingCartItem,
                    quantity = parseInt($this.find('#itemCartDialogQuantity').val()),
                    price = parseFloat($this.find('#itemCartDialogPrice').val()),
                    validProcess = false;

                if (event.which == $.ui.keyCode.ENTER) {
                    // El artículo ya está en el carrito
                    if (eItem) {
                        var difference = eItem.get('quantity') - quantity,
                            price = (eItem.getPrice() != price) ? price : undefined;

                        // Se van a añadir más unidades
                        if (difference < 0) {
                            validProcess = me.addToCart(difference * -1, price);
                        
                        } else {
                            // Establecemos el nuevo precio
                            // (aunque no se varíen las unidades)
                            if (price) {
                                eItem.set('price', price);
                            }

                            // Se quitan unidades
                            if (difference > 0) {                            
                                validProcess = me.removeFromCart(difference);
                            
                            // Hemos cambiado el precio, pero no las unidades
                            } else {
                                validProcess = true;
                            }
                        }

                    // Se añade un nuevo artículo
                    } else if (quantity > 0) {
                        validProcess = me.addToCart(quantity, (price) ? price : undefined);

                    // No se ha hecho nada, cerramos el cuadro
                    } else if (quantity == 0) {
                        validProcess = true;
                    }

                    // Si no ha habido errores,
                    // cerramos la ventana
                    if (validProcess) {
                        $this.dialog('close');
                    }
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

        me._cleanSearch();
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
            unit: item.get('unit'),
            units: item.get('units'),
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
                this._addFirstItem();
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
        try {
            this.shoppingCart.add(this._editingItem, quantity, price);
            alibel.log(__('itemAdded', {
                name:       this._editingItem.get('name'),
                quantity:   quantity,
                units:      (quantity == 1) ? this._editingItem.get('unit')
                                            : this._editingItem.get('units')
            }));
        } catch (e) {
            if (e.type == 'notEnoughStock') {
                var it = this._editingItem,
                    eIt = this._editingCartItem,
                    stock = it.get('stock');
                    if (eIt) stock += eIt.get('quantity');

                alibel.log(__('notEnoughStock', {
                    quantity:   stock,
                    units:      (stock == 1) ? this._editingItem.get('unit')
                                             : this._editingItem.get('units')
                }));
            } else {
                throw e;
            }
            return false;
        }
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
        alibel.log(__('itemRemoved', {
            name:       this._editingItem.get('name'),
            quantity:   quantity,
            units:      (quantity == 1) ? this._editingItem.get('unit')
                                        : this._editingItem.get('units')
        }));

        return this;
    },

    /**
     * Muestra un cuadro de diálogo para completar
     * la compra.
     * @return {this} A sí mismo
     */
    showCompleteDialog: function () {
        var me = this;

        $('<div id="newSellCompleteConfirmDialog">' +
            '<h1>' + __('wannaCompleteSell') + '</h1>' +
            '<input type="checkbox" id="newSellCompletePrintCheck" />' +
            '<label for="newSellCompletePrintCheck">' + __('printTicket') + '</label>' +
        '</div>')
        .dialog({
            autoOpen: true,
            buttons: [
                {
                    text: __('complete'),
                    click: function () {
                        if ($('#newSellCompletePrintCheck').is(":checked")) {
                            alibel.log(__('printNotImplemented'), 'error');
                        }
                        me.completeSell();
                        $(this).dialog('close');
                    }
                },
                {   
                    text: __('cancel'),
                    click: function () {
                        $(this).dialog('close');
                    }
                }
            ],

            open: function () {
                var $this = $(this),
                    $buttons =  $this.next(),
                    $complete = $buttons.find('button:first'),
                    $cancel =   $buttons.find('button:last');

                $complete
                    .addClass('ui-state-highlight')
                    .find('>span')
                    .prepend('<i class="icon-ok-sign"><i> ');
                
                $cancel
                    .addClass('ui-state-error')
                    .find('>span')
                    .prepend('<i class="icon-remove-sign"></i> ');

            },

            close: function () {
                $(this)
                    .dialog('destroy')
                    .remove();
            },

            modal: true,
            draggable: false,
            resizable: false,
            minWidth: 480,
            title: __('completeSell')
        });

        return this;
    },

    /**
     * Muestra un cuadro de diálogo para cancelar
     * la compra.
     * @return {this} A sí mismo
     */
    showCancelDialog: function () {
        var me = this;

        $('<div id="newSellCancelConfirmDialog">' +
            '<h1>' + __('wannaCancelSell') + '</h1>' +
            '<p>' + __('wannaCancelSellDescription') + '.</p>' +
        '</div>')
        .dialog({
            autoOpen: true,
            buttons: [
                {
                    text: __('cancelSell'),
                    click: function () {
                        alibel.log(__('cancelledSell'));
                        me.cancelSell();
                        $(this).dialog('close');
                    }
                },
                {
                    text: __('continueSelling'),
                    click: function () {
                        $(this).dialog('close');
                    }
                }
            ],

            open: function () {
                var $this = $(this),
                    $buttons =  $this.next(),
                    $complete = $buttons.find('button:first'),
                    $cancel =   $buttons.find('button:last');

                $complete
                    .addClass('ui-state-highlight')
                    .find('>span')
                    .prepend('<i class="icon-ok-sign"><i> ');

                $cancel
                    .addClass('ui-state-error')
                    .find('>span')
                    .prepend('<i class="icon-remove-sign"></i> ');

            },

            close: function () {
                $(this)
                    .dialog('destroy')
                    .remove();
            },

            modal: true,
            draggable: false,
            resizable: false,
            minWidth: 480,
            title: __('cancelSell')
        });

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
                date: new Date()
            }, { at: 0 });

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
                .$el.droppable(me._droppableConfig);

            alibel.log(__('completedSell'));
        } else {
            alibel.log(__('emptyCart'), 'error');
        }

        // Reenfoca el cuadro de búsqueda
        this._cleanSearch();

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

        // Reenfoca el cuadro de búsqueda
        this._cleanSearch();
    },

    /* ****************************************************************
     *  Zona privada.
     *  Variables/métodos internos
     * ***************************************************************/

    // Variable interna que se usará para gestionar un item
    // que está siendo añadido/quitado
    _editingItem: null,
    _editingCartItem: null,

    // Configuración necesaria para usar el drag and drop en los items
    _droppableConfig: function () {
        var me = this;
        return {
            activeClass: 'ui-dragging',
            drop: function (event, ui) {
                var code = parseInt(ui.draggable.find('>.code').html(), 10);
                me._editingItem = me._getItem(code);
                me.addToCart();
            }
        };
    },

    /**
     * Activa el drag and drop en los items
     */
    _activateDragAndDrop: function () {
        this._droppableConfig = this._droppableConfig();
        this.$shoppingCart.$el.droppable(this._droppableConfig);
        this.$itemCollection.on('add', this.itemDragging, this);
        for (var code in this.$itemCollection.views) {
            this.itemDragging(this.$itemCollection.views[code]);
        }
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

    /**
     * Añade el primer item de la lista (muestra)
     * el cuadro de diálogo
     */
    _addFirstItem: function () {
        var firstResult =
                $(this.$itemCollectionList
                .find('> li')
                .not('.hidden, .noStock')[0]),
            firstResultCode;

        if (firstResult.length > 0) {
            firstResultCode = firstResult.find('.code').html();
        }

        if (typeof firstResultCode !== 'undefined') {
            var item = this._getItem(parseInt(firstResultCode, 10));
            this.openCartDialog(item);
        }
    },

    /**
     * Enfoca la barra de búsqueda y la deja
     * lista para nuevas búsquedas
     */
    _cleanSearch: function () {
        var me = this,
            $keyboardWrapper = me.$el.find('#newSellSearchKeyboard'),
            $newSellItemSearch =
                me.$el.find('#newSellItemSearch')
                .val('')
                .focus(),

            itemCollectionHeight,
            keyboardHeight;

            $keyboard = $newSellItemSearch.keyboard({
                    layout: 'custom',
                    customLayout: {
                        'default': ['1 2 3 4 5 6 7 8 9 0 {b}',
                                    'Q W E R T Y U I O P',
                                    'A S D F G H J K L Ñ',
                                    'Z X C V B N M . ( )',
                                    '{a} {space} {c}']
                    },

                    initialized: function (event, keyboard, $el) {
                        _.delay(function () {
                            keyboard.$preview.val('');

                            var newLeft = $newSellItemSearch.position().left,
                                newWidth = $newSellItemSearch.width() + 2;

                            keyboard.$keyboard.css({
                                width: newWidth,
                                left: newLeft + 'px',
                                zIndex: 1000
                            });

                            keyboardHeight = keyboard.$keyboard.height() + $newSellItemSearch.height();
                            itemCollectionHeight = me.$itemCollectionList.height();
                        }, 100);
                    },

                    usePreview: false,
                    stayOpen: true,

                    change: function(event, keyboard, $el) {
                        me.$itemCollection.search(
                            keyboard.$preview.val());
                    },

                    accepted: function (event, keyboard, $el) {
                        me._addFirstItem();
                    },

                    canceled: function (event, keyboard, $el) {
                        return false;
                    },

                    visible: function (event, keyboard, $el) {
                        me.$itemCollectionList.animate({
                                "height": itemCollectionHeight - keyboardHeight,
                                "margin-top": keyboardHeight
                            }, 200)
                            .addClass('small');
                    },

                    hidden: function (event, keyboard, $el) {
                        me.$itemCollectionList.delay(250).animate({
                                "height": itemCollectionHeight,
                                "margin-top": 0
                            }, 200)
                            .removeClass('small');
                    }
                });

        this.searchItem($.Event('keyup', { which: ' ' }));
    }
});
