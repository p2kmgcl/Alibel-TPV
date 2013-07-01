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
        App: '1.1.0',

        ItemCartDialog: '1.0.0'
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

    modules: {
        Dialog: '1.0.0'
    },

    // Cadenas de traducción
    i18n: {},

    metadata: {
        name: 'Alibel TPV',
        author: 'Pablo Molina',
        authorLink: 'http://pablomolina.me',
        version: '0.1.0',
        development: false,
        language: 'esES'
    },

    /**
     * Método para crear errores
     * @param  {string} message Contenido del error
     * @param  {function || string} origin  Origen del error
     * @return {this} Se devuelve a sí mismo así que puedes llamarlo con o sin new
     */
    error: function (message, origin, type) {
        this.origin = origin || arguments.callee.caller;
        this.message = message;
        this.type = type;

        this.constructor.prototype.toString = function () {
            return [this.origin.toString(),
                    ' (' + this.type + ')',
                    ': ' + this.message
                    ].join('');
        }
        return this;
    },

    /**
     * Lanza una notificación
     * @param {String} text Contenido explicativo
     * @param {String} type success/error/otracosa
     */
    log: function (text, type) {
        if (type == 'error') {
            alertify.log(text, 'error', 7500);
        } else {
            alertify.log(text, 'success', 5000);
        }
    },

    /**
     * Escribe la cadena de texto correspondiente
     * @param {string} id Id of the string
     * @param {object} vars Variables passed to the template
     */
    __: function (id, vars) {
        if (!alibel.i18n[id]) {
            throw new alibel.error(id + ' is not translated to ' + alibel.metadata.language,
                'alibel.__', 'invalidTranslation');
        }
        return alibel.i18n[id](vars);
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

        // Crea las plantillas de traducción
        var origin = alibel.i18n[alibel.metadata.language],
            translation = {},
            id = [];
        (function (origin) {
            for (var template in origin) {
                id.push(template);
                if (typeof origin[template] == 'string') {
                    translation[id.join('.')] = _.template(origin[template]);
                } else {
                    arguments.callee(origin[template]);
                }
                id.pop();
            }
        }(origin));
        alibel.i18n = translation;
        window.__ = alibel.__;

        // Desactiva la selección y el click derecho
        $(window)
            .on('selectstart', function (event) {
                event.preventDefault();
            })
            .on('mousedown', function (event) {
                if (event.button == 2) {
                    event.preventDefault();
                    return false;
                }
            })
            .on('contextmenu', function (event) {
                event.preventDefault();
                return false;
            });
    }
};

$(alibel.init);
