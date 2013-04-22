/**
 * Barra superior de la aplicación
 * @type {Backbone.View}
 */
window.alibelTPV.views.TopBar = Backbone.View.extend({
    
    template: _.template(window.alibelTPV.templates.TopBar),
    tagName: 'header',
    id: 'topBar',
    
    events: {
        //'click .newSell':     'showSection',
        //'click .history':     'showSection',
        //'click .inventary':   'showSection',
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
     * Muestra la sección Acerca de
     */
    showSectionAbout: function () {
        if (!$("#sectionAbout").hasClass('current')) {
            $("body > section.current").removeClass('current');
            $("#sectionAbout,\
               #mainMenu > ul > .about").addClass('current');
        }
    }
});
