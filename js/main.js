/**
 * Objeto global con toda la configuración del proyecto
 * @type {Object}
 */
 window.alibel = {
    models: {
        Item: '1.0.0',
        ItemCart: '1.0.0'
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

    init: function () {}
};

$(alibel.init);
