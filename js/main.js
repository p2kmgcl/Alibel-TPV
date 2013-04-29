/**
 * Objeto global con toda la configuración del proyecto
 * @type {Object}
 */
 window.alibel = {
    models: {
        Item: '1.0.1',
        ItemCart: '1.0.3',
        ShoppingCart: '1.0.0'
    },

    templates: {
        Item: '1.0.1',
        ItemCart: '1.0.0'
    },

    views: {
        Item: '1.0.1',
        ItemCollection: '1.0.0',
        ItemCart: '1.0.0'
    },

    collections: {
        Item: '1.0.0',
        ItemCart: '1.0.0'
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

    init: function () {}
};

$(alibel.init);
