/**
 * Item mostrado de inventario. Permite mostrar sus datos.
 * @type Backbone.View
 */
alibel.views.ItemInventary = Backbone.View.extend({
    tagName: 'ul',
    className: 'item',
    template: _.template(alibel.templates.Item),
    
    events: {
        'click':    'showItemEdit'
    },
    
    initialize: function () {
        this.render();
        this.model
            .on('change', this.render, this)
            .on('remove', this.destroy, this);
    },
    
    render: function () {
        // Ítems por debajo del stock minimo
        if (this.model.get('stock') < this.model.get('minStock')) {
            this.$el.addClass('lowStock');
        } else {
            this.$el.removeClass('lowStock');
        }
        
        // Ítems sin stock
        if (this.model.get('stock') === 0) {
            this.$el.addClass('noStock');
        } else {
            this.$el.removeClass('noStock');
        }
        
        this.$el.html(this.template(this.model.toJSON()));
    },

    /**
     * Genera una vista de ItemEdit y la muestra
     * para cambiar los datos del item actual.
     */
    showItemEdit: function () {
        var editView = new alibel.views.ItemEdit({
                           model: this.model
                       }),
            dialogView = $(editView.el).dialog({
                autoOpen: false,
                draggable: false,
                maxHeight: 600,
                maxWidth: 800,
                height: $(window).height() * 0.8,
                width: $(window).width() * 0.8,
                modal: true,
                resizable: false,
                title: 'Editando ítem',
                
                // Cuando se cierra el diálogo, elimina el ítem
                close: function () {
                    editView.destroy();
                }
            });
        
        editView.dialog = dialogView;
        $(dialogView).dialog('open');
    },
    
    /**
     * Elimina la vista
     */
    destroy: function () {
        alibel.log('iteminventary-view.destroy()');
        this.remove();
    }
});
