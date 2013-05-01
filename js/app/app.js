/**
 * Vista general de la aplicación.
 * Hace que todo funcione ;)
 * @type {Backbone}
 */
alibel.app.App = Backbone.View.extend({
    tagName: 'div',
    className: 'alibel',
    template: _.template(alibel.templates.App),

    initialize: function () {
        // Crea el inventario, historial y carrito de compra
        // principal
        this.inventary = new alibel.collections.Item();
        this.history = new alibel.collections.ShoppingCart();
        this.shoppingCart = new alibel.models.ShoppingCart({
            collection: new alibel.collections.Item()
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
                itemCollection: this.inventary
            })
        };

        this.render();
        return this;
    },

    render: function () {
        this.$el.html(alibel.templates.App);

        // Añade el contenido de las pestañas
        for (var x in this.sections) {
            this.$el.append(this.sections[x].el);
        }
        this.$el.tabs();

        // Activa el reloj
        var me = this;
        $(function () { me.renderClock() });

        return this;
    },

    /**
     * Actualiza el reloj cada 30 segundos
     */
    renderClock: function () {
        var now = new Date(),
            text = now.getDate() + '/' +
                   (now.getMonth() + 1) + '/' +
                   now.getFullYear() + ' ' +
                   now.getHours() + ':' +
                   now.getMinutes();

        $('#alibelMainClock > time').html(text);
        setTimeout(arguments.callee, 30000);
    }

});
