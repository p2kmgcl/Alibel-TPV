/**
 * Objeto global con toda la configuración del proyecto
 * @type {Object}
 */
 window.alibel = {
    models: {
        Item: undefined,
        ItemCart: undefined
    },

    templates: {},

    views: {},

    collections: {},

    metadata: {
        version: '0.1.0',
        development: true
    },

    init: function () {}
};

$(alibel.init);
