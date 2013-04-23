/**
 * Vista utilizada para renderizar la sección inventario.
 * Muestra la lista de ítems y permite editarlos.
 */
window.alibelTPV.views.sections.Inventary = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionInventary',
    template: _.template(window.alibelTPV.templates.sections.Inventary),
    views: {},
    
    events: {
        'keyup #inventarySearch':  'filterItems'
    },
    
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
        var code = item.get('code');
        this.views[code] = new window.alibelTPV.views.ItemInventary({
            model: item
        });
        this.$el.find('#inventaryItemList').append(this.views[code].el);
    },

    /**
     * Filtra los ítems buscados para esconder el resto
     */
    filterItems: function () {
        var search = this.$el.find('#inventarySearch').val().toLowerCase();
        
        for (var x in this.views) {
            this.views[x].$el.removeClass('hidden');
        }
        
        var byName = this.model.filterItemByName(search),
            byCode = this.model.filterItemByCode(search);

        _.each(_.intersection(byName, byCode), function (item) {
            this.views[item.get('code')].$el.addClass('hidden');
        }, this);
    },
    
    render: function () {
        this.$el.html(this.template());
    }
});
