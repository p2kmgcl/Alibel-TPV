/**
 * Vista utilizada para renderizar la sección inventario.
 * Muestra la lista de ítems y permite editarlos.
 */
alibel.views.sections.Inventary = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionInventary',
    template: _.template(alibel.templates.sections.Inventary),
    
    // Objeto con todas las vistas añadidas para encontrarlas y eliminarlas.
    // cada ítem está guardado por su código.
    views: {},
    
    events: {
        'keyup #inventarySearch':  'filterItems'
    },
    
    initialize: function () {
        $('body').append(this.el);
        this.render();
        
        this.model.get('items').on('add', this.itemAdded, this);
    },
    
    /**
     * Cuando un item es añadido al inventario también se añade a esta vista.
     * @param {alibel.models.Item} item Item que se va a añadir a la lista.
     */
    itemAdded: function (item) {
        var code = item.get('code');
        this.views[code] = new alibel.views.ItemInventary({
            model: item
        });
        this.$el.find('#inventaryItemList').append(this.views[code].el);
    },

    /**
     * Filtra los ítems buscados para esconder el resto
     */
    filterItems: function () {
        // Pasa la cadena de búsqueda a minúsculas para habilitar la búsqueda
        // ignorando mayúsculas
        var search = this.$el.find('#inventarySearch').val().toLowerCase();
        
        // Itera en todas las vistas y elimina su clase hidden
        for (var x in this.views) {
            this.views[x].$el.removeClass('hidden');
        }
        
        // Obtiene los resultados de ítems que NO encajan según su nombre
        // y según su código
        var byName = this.model.filterItemByName(search),
            byCode = this.model.filterItemByCode(search);

        // La intersección de los dos conjuntos obtenidos es el resultado
        // de los ítems que deben esconderse
        _.each(_.intersection(byName, byCode), function (item) {
            this.views[item.get('code')].$el.addClass('hidden');
        }, this);
    },
    
    render: function () {
        this.$el.html(this.template());
    }
});
