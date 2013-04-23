/**
 * Item mostrado en el inventario listo para editar
 * @type Backbone.View
 */
window.alibelTPV.views.ItemInventary = Backbone.View.extend({
    tagName: 'ul',
    className: 'item',
    template: _.template(window.alibelTPV.templates.Item),
    
    events: {
        'click':    'showItemEdit'
    },
    
    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },
    
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },

    /**
     * Genera una vista de ItemEdit y la muestra
     * para cambiar los datos del item actual.
     */
    showItemEdit: function () {
        var editView = new window.alibelTPV.views.ItemEdit({
                           model: this.model
                       });
        $('body').append(editView.el);
    }
});
