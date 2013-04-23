/**
 * Vista utilizada para renderizar la sección inventario.
 * Muestra la lista de ítems y permite editarlos.
 */
window.alibelTPV.views.sections.Inventary = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionInventary',
    template: _.template(window.alibelTPV.templates.sections.Inventary),
    
    initialize: function () {
        $('body').append(this.el);
        this.render();
    },
    
    render: function () {
        this.$el.html(this.template());
    }
});
