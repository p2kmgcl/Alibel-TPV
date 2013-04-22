/**
 * Barra superior de la aplicación
 * @type {Backbone.View}
 */
window.alibelTPV.views.TopBar = Backbone.View.extend({
    
    template: _.template(window.alibelTPV.templates.TopBar),
    tagName: 'header',
    id: 'topBar',
    
    initialize: function () {
        $('body').append(this.el);
        this.render();
    },
            
    render: function () {
        this.$el.html(this.template());
    }
});
