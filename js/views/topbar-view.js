/**
 * Barra superior de la aplicación
 * @type {Backbone.View}
 */
window.alibelTPV.views.TopBar = Backbone.View.extend({
    
    template: _.template(window.alibelTPV.templates.TopBar),
    tagName: 'header',
    id: 'topBar',
    
    events: {
        'click .newSell':       'showSectionNewSell',
        //'click .history':     'showSection',
        'click .inventary':     'showSectionInventary',
        'click .about':         'showSectionAbout'
    },
    
    initialize: function () {
        $('body').append(this.el);
        this.render();
    },
            
    render: function () {
        this.$el.html(this.template());
    },
    
    /**
     * Método usado por todos los cambios de sección.
     * Esconde la sección actual y la desmarca del menú.
     */
    hideCurrenSection: function () {
        $("body > section.current,\
           #mainMenu > ul > .current").removeClass('current');
    },
    
    /**
     * Muestra la sección Acerca de
     */
    showSectionAbout: function () {
        if (!$("#sectionAbout").hasClass('current')) {
            this.hideCurrenSection();
            $("#sectionAbout,\
               #mainMenu > ul > .about").addClass('current');
        }
    },
    
    /**
     * Muestra la sección de inventario
     */
    showSectionInventary: function () {
        if (!$("#sectionInventary").hasClass('current')) {
            this.hideCurrenSection();
            $("#sectionInventary,\
               #mainMenu > ul > .inventary").addClass('current');
        }
    },
    
    /**
     * Muestra la sección para realizar ventas
     */
    showSectionNewSell: function () {
        if (!$("#sectionNewSell").hasClass('current')) {
            this.hideCurrenSection();
            $("#sectionNewSell,\
               #mainMenu > ul > .newSell").addClass('current');
        }
    }
});
