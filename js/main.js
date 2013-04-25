/**
 * Objeto global con toda la configuración del proyecto
 * @type {Object}
 */
window.alibelTPV = {

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
        version: '0.1.0'
    },

    init: function () {
        window.alibelTPV.main.inventary = new window.alibelTPV.models.Inventary();
        window.alibelTPV.main.history = new window.alibelTPV.models.History();
        
        window.alibelTPV.main.DOM.topBar = new window.alibelTPV.views.TopBar();
        window.alibelTPV.main.DOM.sections.about = new window.alibelTPV.views.sections.About();
        window.alibelTPV.main.DOM.sections.newsell = new window.alibelTPV.views.sections.NewSell();
        window.alibelTPV.main.DOM.sections.inventary = new window.alibelTPV.views.sections.Inventary({
            model: window.alibelTPV.main.inventary
        });
        
        // Carga el inventario
        window.$.getJSON('data/inventary.json', window.alibelTPV.main.inventary.fromJSON);
    }

};

$(window.alibelTPV.init);
