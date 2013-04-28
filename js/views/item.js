/**
 * Item mostrado de inventario. Permite mostrar sus datos.
 * @type Backbone.View
 */
alibel.views.Item = Backbone.View.extend({
    tagName: 'ul',
    className: 'item',
    template: _.template(alibel.templates.Item),
    
    // Crea la vista y asigna los eventos pertinentes
    initialize: function () {
        this.render()
            .model
                .on('change', this.render, this)
                .on('remove', this.remove, this);

        return this;
    },
    
    /**
     * Renderiza la vista y la muestra
     * @return {alibel.views.Item} Se devuelve a sí mismo
     */
    render: function () {
        // Ítems por debajo del stock minimo
        (this.model.get('stock') < this.model.get('minStock')) ?
            this.$el.addClass('lowStock'):
            this.$el.removeClass('lowStock');
        
        // Ítems sin stock
        (this.model.get('stock') === 0) {
            this.$el.addClass('noStock'):
            this.$el.removeClass('noStock');
        
        // Finalmente construye el item
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
