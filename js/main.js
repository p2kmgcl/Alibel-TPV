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
        Section: undefined,
        TopBar: undefined
    },
            
    templates: {
        topBar: undefined
    },

    main: {
        inventary: undefined,
        history: undefined,
        
        DOM: {
            topBar: undefined
        }
    },

    init: function () {
        window.alibelTPV.main.inventary = new window.alibelTPV.models.Inventary();
        window.alibelTPV.main.history = new window.alibelTPV.models.History();
        
        window.alibelTPV.main.DOM.topBar = new window.alibelTPV.views.TopBar();

        window.alibelTPV = window.alibelTPV.main;
    }

};

$(window.alibelTPV.init);
