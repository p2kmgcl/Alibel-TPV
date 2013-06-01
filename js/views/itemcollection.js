/**
 * Vista de una lista de ítems
 * Contiene una colección de ítems en this.collection y
 * un array de vistas en this._views
 */
alibel.views.ItemCollection = Backbone.View.extend({
    tagName: 'ul',
    className: 'itemList',

    // Texto con el que se identifica a cada item para eliminarlo
    wrapperClass: 'itemWrapper',

    initialize: function () {
        this.views = {};

        // Genera las nuevas vistas en la colección
        // y crea los eventos de escucha para añadir/quitar
        // items
        this.collection
            .on('add', this.add, this)
            .on('remove', this.remove, this)
            .on('change', this.checkStock, this)
            .each(this.add, this);
    },

    /**
     * Genera una vista para el nuevo ítem
     * @param {alibel.models.Item} item Item para el que se
     * generará la vista
     */
    add: function (item) {
        // Genera la vista del item añadido
        var newView = new alibel.views.Item({
            model: item
        });

        // Envuelve al item con un elemento li
        // por cuestión de semántica
        var $li = $(document.createElement('li'))
                    .addClass(this.wrapperClass + item.get('code'))
                    .append(newView.el);

        // Añade la nueva vista a la lista de items
        this.views[item.get('code')] = $li;
        this.$el.append($li);

        // Comprueba el stock del item
        this.checkStock(item);

        // Lanza el evento
        this.trigger('add', newView);
        return this;
    },

    /**
     * Elimina un item de la lista de vistas y del DOM
     * @param  {alibel.models.Item} item Item a eliminar
     * @return {alibel.views.ItemCollection}  Se devuelve a sí mismo
     */
    remove: function (item) {
    	// Busca el item en las vistas
        var itemView = this.views[item.get('code')];

        if (!itemView) {
			throw new alibel.error('Item with code '
				+ item.get('code') + ' doesnt have a view in this collection',
				'alibel.views.ItemCollection');
        }
        
        itemView.remove();
        delete itemView;

        // Lanza el evento y finaliza
        this.trigger('remove');
        return this;
    },

    /**
     * Si un item tiene stock bajo o esta sin stock debemos
     * añadir la clase.
     */
    checkStock: function (item) {
        var $item = this.views[item.get('code')]

        $item
          .removeClass('noStock')
          .removeClass('lowStock');

        if (item.get('stock') === 0) {
            $item.addClass('noStock');
        }
        if (item.get('stock') < item.get('minStock')) {
            $item.addClass('lowStock');
        }

        // Lanza el evento
        this.trigger('change', $item);
        return this;
    },

    /**
     * Busca un ítem por su nombre o código.
     * Mostrará todos los resultados posibles
     * @param {string} key Clave por la que se buscará al ítem
     */
    search: function (key) {
        var result = this.collection.search(key),
            // ítems a esconder (no forman parte del resultado)
            inverse = _.difference(this.collection.toArray(),
                                     result);

        // Muestra todos los ítems escondidos (por antiguas búsquedas)
        // y finalmente esconde los que no encajan en el resultado
        this.$el.find(' > li.hidden').removeClass('hidden');
        _.each(inverse, function (item) {
            this.views[item.get('code')].addClass('hidden');
        }, this);

        return this;
    }
});
