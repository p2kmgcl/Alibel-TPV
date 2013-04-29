/**
 * Item mostrado de inventario. Permite mostrar sus datos.
 * @type Backbone.View
 */
alibel.views.ItemCart = Backbone.View.extend({
    tagName: 'ul',
    className: 'item',
    template: _.template(alibel.templates.ItemCart),
    
    // Crea la vista y asigna los eventos pertinentes
    initialize: function () {
        this.render()
            .model
                .on('change', this.render, this)
                .on('remove', this.remove, this)
            .get('item')
                .on('change', this.render, this)
                .on('remove', this.remove, this);

        return this;
    },
    
    /**
     * Renderiza la vista y la muestra
     * @return {alibel.views.ItemCart} Se devuelve a sí mismo
     */
    render: function () {
        this.$el
            .addClass('itemCart')
            .html(this.template({
                code: this.model.get('item').get('code'),
                name: this.model.get('item').get('name'),
                price: this.model.getPrice(),
                quantity: this.model.get('quantity')
            }));
        return this;
    }
});
