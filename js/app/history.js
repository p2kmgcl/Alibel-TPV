/**
 * Vista de historial de la aplicación
 * @type {[type]}
 */
alibel.app.History = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionHistory',
    template: _.template(alibel.templates.History),

    events: {
        'change .dateFilter > input':    'filterByDate',
        'click .shoppingCartList > li':  'showCartOptions'
    },

    initialize: function (attrs) {
        this.shoppingCartCollection = new alibel.views.ShoppingCartCollection({
            collection: attrs.shoppingCartCollection
        });
        this.render();
        return this;
    },

    render: function () {
        // Renderiza la plantilla y añade la lista de compras
        this.$el
            .html(this.template())
            .append(this.shoppingCartCollection.el);

        // Crea los diálogos para escoger la fecha
        // de jQueryUI. Por defecto muestra las compras
        // entre la semana pasada y hoy.
        // 
        // Hace una pequeña espera para que de tiempo a generar
        // todo el DOM
        var me = this;
        _.delay(function () {
            var opts = {
                    showButtonPanel: true,
                    firstDay: 1,
                    onSelect: this.filterByDate
                };

            $.datepicker.regional['es'];
            $("#historyDateFilterTo")
                .datepicker(opts)
                .datepicker('setDate', new Date());

            opts.defaultDate = -7;
            $('#historyDateFilterFrom')
                .datepicker(opts)
                .datepicker('setDate', -3);

            me.filterByDate();
        }, 1000);

        return this;
    },

    /**
     * Muestra las opciones disponibles con
     * un carrito (imprimir, eliminar, cancelar).
     */
    showCartOptions: function (event) {
        $('<div id="historyCartOptionsDialog">' +
            '<h1>¿Que desea hacer con la compra?</h1>' +
        '</div>')
        .dialog({
            autoOpen: true,
            buttons: [
                {
                    text: 'Imprimir',
                    click: function () {
                        alibel.notify('Lo sentimos, pero el sistema de impresión ' +
                            'no está disponible aún', 'error');
                        $(this).dialog('close');
                    }
                },
                {
                    text: 'Eliminar',
                    click: function () {
                        alibel.notify('Eliminación no implementada (de momento)', 'error');
                        $(this).dialog('close');
                    }
                },
                {   
                    text: 'Cancelar',
                    click: function () {
                        $(this).dialog('close');
                    }
                }
            ],

            open: function () {
                var $this =     $(this),
                    $buttons =  $this.next(),
                    $print =    $buttons.find('button:first'),
                    $delete =   $print.next(),
                    $cancel =   $delete.next();

                $print
                    .addClass('ui-state-highlight')
                    .find('>span')
                    .prepend('<i class="icon-print"><i> ');

                $delete
                    .addClass('ui-state-highlight')
                    .find('>span')
                    .prepend('<i class="icon-trash"><i> ');
                
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
            title: 'Editando compra'
        });

        return this;
    },

    /**
     * Filtra las compras por fecha
     * @return {this}
     */
    filterByDate: function () {
        var from = new Date($("#historyDateFilterFrom").datepicker('getDate')),
            to = new Date($("#historyDateFilterTo").datepicker('getDate'));

        // Hace que la selección abarque todo el día
        to.setHours(23);
        to.setMinutes(59);
        to.setSeconds(59);
        this.shoppingCartCollection.filterByDate(from, to);
        return this;
    }
});
