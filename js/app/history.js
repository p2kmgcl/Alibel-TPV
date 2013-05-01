/**
 * Vista de historial de la aplicación
 * @type {[type]}
 */
alibel.app.History = Backbone.View.extend({
    tagName: 'section',
    className: 'sectionHistory',
    template: _.template(alibel.templates.History),

    events: {
        'change .dateFilter > input':    'filterByDate'
    },

    initialize: function (attrs) {
        this.shoppingCartCollection = attrs.shoppingCartCollection;
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
        // entre la semana pasada y hoy
        var me = this;
        $(function () {
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
                .datepicker('setDate', -7);

            me.filterByDate();
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
