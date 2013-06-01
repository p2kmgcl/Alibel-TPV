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
        // Referencia a this necesaria
        // para acceder al objeto global
        // cuando haya cargado todo
        var me = this;

        // Crea el inventario, historial y carrito de compra
        // principal
        this.inventary = new alibel.collections.Item();
        this.history = new alibel.collections.ShoppingCart();
        this.shoppingCart = new alibel.models.ShoppingCart({
            collection: new alibel.collections.ItemCart()
        });

        // Carga el inventario
        $.getJSON('data/inventary_huge.json', function (data) {
            me.inventary.addFromJSON(data, function () {

                // Carga el historial cuando los items están listos
                $.getJSON('data/history.json', function (data) {
                    
                    // Procesa la interfaz cuando cargue el inventario
                    me.history.addFromJSON(data, me.inventary, function () {

                        // Crea las secciones de la aplicación
                        me.sections = {
                            about: new alibel.app.About(),
                            history: new alibel.app.History({
                                shoppingCartCollection: me.history
                            }),
                            inventary: new alibel.app.Inventary({
                                itemCollection: me.inventary
                            }),
                            newsell: new alibel.app.NewSell({
                                shoppingCart: me.shoppingCart,
                                itemCollection: me.inventary,
                                shoppingCartCollection: me.history
                            })
                        };

                        // Renderiza todo
                        me.render();
                    });
                });
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

        // Oculta el diálogo de carga
        $('body > .alibel-loading')
            .delay(500)
            .fadeOut(1000);

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
