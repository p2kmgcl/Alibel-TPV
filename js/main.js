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
        TopBar: undefined,
        sections: {
            About: undefined
        }
    },
            
    templates: {
        topBar: undefined,
        sections: {
            About: undefined
        }
    },

    main: {
        inventary: undefined,
        history: undefined,
        
        DOM: {
            topBar: undefined,
            sections: {
                about: undefined
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
        
        // Carga el inventario
        window.$.getJSON('data/inventary.json', window.alibelTPV.main.inventary.fromJSON);
    }

};

$(window.alibelTPV.init);
