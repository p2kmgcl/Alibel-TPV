/**
 * Vista diseñada para editar un ítem existente
 * @type Backbone.View
 */
window.alibelTPV.views.ItemEdit = Backbone.View.extend({
    tagName: 'form',
    className: 'itemEdit',
    template: _.template(window.alibelTPV.templates.ItemEdit),
    
    events: {
        'click .acceptButton':    'saveChanges',
        'click .cancelButton':    'undoChanges'
    },
    
    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
    },
    
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    },
    
    /**
     * Guarda los cambios del item editado actualizándolos
     * desde el formulario que se crea en la vista
     */
    saveChanges: function () {
        console.log('Cambios guardados...');
        this.remove();
    },
    
    /**
     * Destruye el cuadro de diálogo sin guardar ningún cambio
     * realizado
     */
    undoChanges: function () {
        console.log('Cambios cancelados...');
        this.remove();
    }
});
