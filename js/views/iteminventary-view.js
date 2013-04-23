/**
 * Item mostrado en el inventario listo para editar
 * @type Backbone.View
 */
window.alibelTPV.views.ItemInventary = Backbone.View.extend({
    tagName: 'ul',
    className: 'item',
    template: _.template(window.alibelTPV.templates.Item),
    
    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },
    
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    }
});
