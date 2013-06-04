/**
 * Vista general de la aplicación.
 * Hace que todo funcione ;)
 * @type {Backbone}
 */
alibel.app.App = Backbone.View.extend({
    tagName: 'div',
    id: 'alibel',
    template: _.template(alibel.templates.App),

    events: {
        'click .menuOption > i': 'mainMenuClick',
        'click .menuOption > [href^=#sectionNewSell]': 'focusNewSellSearch',
        'click .menuOption > [href^=#sectionInventary]': 'focusInventarySearch'
    },

    initialize: function () {
        // Crea el inventario, historial y carrito de compra
        // principal
        this.inventary = new alibel.collections.Item();
        this.history = new alibel.collections.ShoppingCart();
        this.shoppingCart = new alibel.models.ShoppingCart({
            collection: new alibel.collections.ItemCart()
        });

        // Crea las secciones de la aplicación
        this.sections = {
            about: new alibel.app.About(),
            history: new alibel.app.History({
                shoppingCartCollection: this.history
            }),
            inventary: new alibel.app.Inventary({
                itemCollection: this.inventary
            }),
            newsell: new alibel.app.NewSell({
                shoppingCart: this.shoppingCart,
                itemCollection: this.inventary,
                shoppingCartCollection: this.history
            })
        };

        // Carga el inventario
        var me = this;
        $.getJSON('data/inventary.json', function (data) {
            me.inventary.addFromJSON(data);
            $.getJSON('data/history.json', function (data) {
                me.history.addFromJSON(data, me.inventary);
                me.render();
            });
        });

        return this;
    },

    render: function () {
        this.$el.html(alibel.templates.App);

        // Añade el contenido de las pestañas
        for (var x in this.sections) {
            this.$el.find('>.content').append(this.sections[x].el);
        }
        this.$el.find('>.content').tabs();

        // Crea el set de botones completar/cancelar
        this.$el.find('.newSellEnd').buttonset();

        // Activa el reloj
        var me = this;
        $(function () { me.renderClock() });

        // Por defecto enfoca al la busqueda
        // de items para nuevas ventas
        this.focusNewSellSearch();

        return this;
    },

    /** Hace que se pueda hacer click en cualquier
     parte del botón de menú */
    mainMenuClick: function () {
        $(event.target).find('~ a').trigger('click');
    },

    /** Enfoca la barra de búsqueda para nuevas compras */
    focusNewSellSearch: function () {
        $('#newSellItemSearch').focus();
    },

    /** Enfoca la barra de búsqueda para el inventario */
    focusInventarySearch: function () {
        $('#inventaryItemSearch').focus();
    },

    /**
     * Actualiza el reloj cada 30 segundos
     */
    renderClock: function () {
        $('#alibelMainClock > time').html(alibel.formatDate(new Date()));
        setTimeout(arguments.callee, 30000);
    }

});
