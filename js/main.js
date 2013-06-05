/**
 * Objeto global con toda la configuración del proyecto
 * @type {Object}
 */
 window.alibel = {
    models: {
        Item: '1.0.2',
        ItemCart: '1.1.0',
        ShoppingCart: '1.1.0'
    },

    templates: {
        Item: '1.0.1',
        ItemCart: '1.0.0',
        ShoppingCart: '1.0.0',

        History: '1.2.0',
        Inventary: '1.2.0',
        NewSell: '1.2.0',
        About: '1.2.0',
        App: '1.1.0'
    },

    views: {
        Item: '1.0.1',
        ItemCollection: '1.0.0',
        ItemCart: '1.0.0',
        ShoppingCart: '1.0.0',
        ShoppingCartCollection: '1.0.0'
    },

    collections: {
        Item: '1.1.0',
        ItemCart: '1.0.0',
        ShoppingCart: '1.0.0'
    },

    app: {
        History: '1.1.0',
        Inventary: '1.0.0',
        NewSell: '1.0.1',
        About: '1.0.0',
        App: '1.0.0'
    },

    metadata: {
        version: '0.1.0',
        development: true
    },

    /**
     * Método para crear errores
     * @param  {string} message Contenido del error
     * @param  {function || string} origin  Origen del error
     * @return {this} Se devuelve a sí mismo así que puedes llamarlo con o sin new
     */
    error: function (message, origin) {
        this.origin = origin || arguments.callee.caller;
        this.message = message;

        this.constructor.prototype.toString = function () {
            return this.origin.toString() + ': ' + this.message;
        }
        return this;
    },

    /**
     * Devuelve la fecha formada correctamente
     * según el esquema usado en la aplicación
     * @param  {Date} date Fecha que se quiere mostrar
     * @return {string} Fecha correctamente escrita
     */
    formatDate: function (date) {
        if (!(date instanceof Date)) {
            throw new alibel.error('Incorrect param date',
                'alibel.formatDate');
        }

        var minutes = ((date.getMinutes() < 10) ? '0' : '') +
                        date.getMinutes();

        return date.getDate() + '/' +
                (date.getMonth() + 1) + '/' +
                 date.getFullYear() + ' ' +
                 date.getHours() + ':' +
                 minutes;
    },

    init: function () {
        var app = new alibel.app.App();
        $('body').append(app.el);

        // Permite el acceso desde el exterior
        alibel.instance = app;
    }
};

$(alibel.init);
