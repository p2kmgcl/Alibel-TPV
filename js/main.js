/**
 * Objeto global con toda la configuración del proyecto
 * @type {Object}
 */
window.alibel = {

    models: {
        Item: undefined,
        ItemCart: undefined,
        ShoppingCart: undefined,

        History: undefined,
        Inventary: undefined
    },

    collections: {
        Item: undefined,
        ItemCart: undefined,
        ShoppingCart: undefined
    },

    views: {
        ItemInventary: undefined,
        ItemEdit: undefined,
        TopBar: undefined,
        sections: {
            About: undefined,
            Inventary: undefined,
            NewSell: undefined
        }
    },
            
    templates: {
        Item: undefined,
        ItemEdit: undefined,
        topBar: undefined,
        sections: {
            About: undefined,
            Inventary: undefined,
            NewSell: undefined
        }
    },

    main: {
        inventary: undefined,
        history: undefined,
        
        DOM: {
            topBar: undefined,
            sections: {
                about: undefined,
                inventary: undefined,
                newsell: undefined
            }
        }
    },
            
    metadata: {
        version: '0.1.0',
        development: true
    },
    
    /**
     * Envía los parámetros pasados a la consola.
     * Solo se hará si la variable alibel.metadata.development tiene
     * un valor verdadero
     */
    log: function (message) {
        if (alibel.metadata.development) {
            console.log(message);
        }
    },

    init: function () {
        alibel.main.inventary = new alibel.models.Inventary();
        alibel.main.history = new alibel.models.History();
        
        alibel.main.DOM.topBar = new alibel.views.TopBar();
        alibel.main.DOM.sections.about = new alibel.views.sections.About();
        alibel.main.DOM.sections.newsell = new alibel.views.sections.NewSell();
        alibel.main.DOM.sections.inventary = new alibel.views.sections.Inventary({
            model: alibel.main.inventary
        });
        
        // Carga el inventario
        window.$.getJSON('data/inventary.json', alibel.main.inventary.fromJSON);
    }

};

$(alibel.init);
