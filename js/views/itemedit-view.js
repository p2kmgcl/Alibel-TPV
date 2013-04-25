/**
 * Vista diseñada para editar un ítem existente
 * @type Backbone.View
 */
alibel.views.ItemEdit = Backbone.View.extend({
    tagName: 'form',
    className: 'itemEdit',
    template: _.template(alibel.templates.ItemEdit),
    
    events: {
        'click .acceptButton':    'saveChanges',
        'click .cancelButton':    'destroy',
        'click .deleteButton':    'deleteOriginalModel',
        'keyup':                  'keyboardCheck'
    },
    
    initialize: function () {
        this.render();
        this.model
            .on('change', this.render, this)
            .on('remove', this.destroy, this);
    },
    
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.find('input[type^=button]').button();
    },
    
    /**
     * Guarda los cambios del item editado actualizándolos
     * desde el formulario que se crea en la vista
     */
    saveChanges: function () {
        var model = this.model,
            realChanges = { validate: true };
        
        // Examina todos los elementos del formulario para ver
        // cuales cambia y cuales no
        this.$el.find('input').not('[type^=button]').each(function () {
            var value = $(this).val(),
                name = $(this).attr('name');
            
            if (model.get(name).toString() !== value) {
                realChanges[name] = value;
            }
        });
        
        // Envía los cambios al modelo y éste los validará
        alibel.log('Editando ítem:');
        alibel.log(realChanges);
        model.set(realChanges);
        
        // Destruye el cuadro de diálogo
        this.destroy();
    },
    
    /**
     * Hace comprobaciones de usabilidad para poder manejar la interfaz
     * con el teclado.
     * @param {Event} event Variable del evento keyup.
     */
    keyboardCheck: function (event) {
        var ENTER_KEY = 13,
            ESCAPE_KEY = 27;
        
        switch (event.which) {
            case ENTER_KEY: this.saveChanges();
                            break;
            case ESCAPE_KEY: this.destroy();
                             break;
        }
    },
    
    
    /**
     * Destruye el ítem original
     */
    deleteOriginalModel: function () {
        this.model.destroy();
    },
    
    /**
     * Elimina la vista de edición
     */
    destroy: function () {
        alibel.log('itemedit-view.destroy()');
        this.remove();
    }
});
