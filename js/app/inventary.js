/**
 * Vista para gestionar el inventario
 * @type {Backbone.View}
 */
alibel.app.Inventary = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionInventary',
    template: _.template(alibel.templates.Inventary),

    events: {
        'click .stockFilter input': 'changeStockFilter',
        'keyup #inventaryItemSearch': 'searchItem',
        'click .keyboardQwerty td':      'virtualKeyboardHandler',
        'click #inventaryUpdateButton': 'updateInventary',
        'click #inventaryAddNewItemButton': 'addNewItem'
    },

    initialize: function (params) {
        this.itemCollection = new alibel.views.ItemCollection({
            collection: params.itemCollection
        });
        this.render();
        return this;
    },

    render: function () {
        this.$el
            .html(this.template())
            .prepend(this.itemCollection.el);

        var $el = this.$el;
        $(function () {
            $el.find('.stockFilter input').button();
            $el.find('.inventaryEdit button').button();
        });
    },

    /**
     * Cambia el filtro de items con respecto a su stock
     * @param  {Event} event Evento de click en uno de los botones
     * @return {this}
     */
    changeStockFilter: function (event) {
        var val = event.target.value,
            list = this.$el.find('.itemList');

        list.removeClass('lowStock')
            .removeClass('noStock');

        if (val === 'noStock' || val === 'lowStock') {
            list.addClass(val);
        }
        return this;
    },

    /**
     * Busca un item por su nombre o su código.
     * Este método reacciona ante el evento de tecleo en la barra de
     * búsqueda.
     */
    searchItem: function () {
        this.itemCollection.search(
            $("#inventaryItemSearch").val());
    },

    /**
     * Procesa la entrada del teclado virtual
     */
    virtualKeyboardHandler: function (e) {
        var key = e.target.innerText,
            $search = $('#inventaryItemSearch'),
            search  = $search.val();

        if (key == '{ca}') {
            $search.val(search.substr(0, search.length - 1))
                   .focus();
            this.searchItem();
        } else if (key == '{ok}') {
            $search.focus();
            this.searchItem({
                which: 13
            });
        } else {
            if (key == '{sp}') {
                key = ' ';
            }
            $search.val(search + key).focus();
            this.searchItem();
        }
    },

    updateInventary: function (e) {
        e.preventDefault();
        alibel.log(__('inventaryUpdateNotAvailable'), 'error');
    },

    addNewItem: function (e)  {
        e.preventDefault();
        alibel.log(__('addItemNotAvailable'), 'error');
    }
});
