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
        this.model.on('change', this.render, this);
        this.model.get('items')
                .on('add', this.addItem, this);
    },
    
    /**
     * Cuando un item es añadido al inventario,
     * también se añade a esta vista.
     * @param {alibelTPV.models.Item} item Item que se va a añadir a la lista.
     */
    addItem: function (item) {
        this.$el.find('#inventaryItemList')
            .append(new window.alibelTPV.views.ItemInventary({
                model: item
            }).el);
    },
    
    render: function () {
        this.$el.html(this.template());
    }
});
