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
        'click .cancelButton':    'undoChanges',
        'click .deleteButton':    'deleteItem'
    },
    
    initialize: function () {
        this.render();
        this.model.on('change', this.render, this);
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
        var realChanges = {},
            model = this.model;
        
        // Examina todos los elementos del formulario para ver
        // cuales cambia y cuales no
        this.$el.find('input').not('[type^=button]').each(function () {
            var value = $(this).val(),
                name = $(this).attr('name'),
                asign = true;
            
            // Aquí se hacen las comprobaciones para ver
            // que atributos NO se modifican
            switch(name) {
                case 'stock':
                    value = parseInt(value);
                    if (value < 0) {
                        asign = false;
                    }
                    break;
                case 'minStock':
                    value = parseInt(value);
                    if (value < 0) {
                        asign = false;
                    }
                    break;
                case 'maxStock':
                    value = parseInt(value);
                    if (value === '') {
                        value = Infinity;
                    } else if (value <= 0) {
                        asign = false;
                    }
                    break;
            }
            
            if (asign) {
                model.set(name, value);
            }
        });
        
        $(this.dialog).dialog('destroy');
        this.remove();
    },
    
    /**
     * Destruye el cuadro de diálogo sin guardar ningún cambio
     * realizado
     */
    undoChanges: function () {
        $(this.dialog).dialog('destroy');
        this.remove();
    },
    
    /**
     * Elimina el ítem que se está editando
     */
    deleteItem: function () {
        this.model.destroy();
        this.undoChanges();
    }
});
