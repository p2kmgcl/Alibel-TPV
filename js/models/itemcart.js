/**
 * Item almacenado en un carrito de compra.
 * Requiere un modelo Item
 * @type {Backbone.Model}
 */
alibel.models.ItemCart = Backbone.Model.extend({
	defaults: {
		item: null,
		quantity: 0,
		price: -1
	},

	// Inicializa el ítem de carrito
    initialize: function () {
        // Activa la comprobación de errores
        this.on('invalid', this.throwError, this);
        if (typeof this.validate(this.attributes) !== 'undefined') {
            this.trigger('invalid');
        }
    },
    
    /**
     * Básicamente lanza el error ocasionado
     * @param {Backbone.Model} model Modelo en el que se ha producido el error
     * @param {string} message Descripción del error
     */
    throwError: function (model, error) {
        throw new Error(error);
        return this;
    },

    /**
     * Devuelve el precio del item de carrito si existe
     * o el precio original si no está especificado
     * @return {number} Precio final
     */
    getPrice: function () {
        return (this.get('price') > -1) ?
                    this.get('price'):
                    this.get('item').get('price');
    },
    
    /**
     * Comprueba que los atributos pasados al ítem cumplen todas las condiciones
     * establecidas.
     * @param {object} attrs Objeto con los atributos del ítem que van
     *  a comprobarse.
     */
    validate: function (attrs) {
    		// Si el item no es correcto no nos queda nada que validar...
    		if (!(attrs.item instanceof alibel.models.Item)) {
    			return 'Invalid item';
    		}

    		/**
     	 * Checkea si el número cumple las siguientes condiciones:
          *  - Ser un número
          *  - No ser NaN
          *  - Ser finito
          *  - Ser mayor o igual a cero
          * @param {number} number Número que se comprobará
          */
     	function validNumber (number) {
     	    return (_.isNumber(number) &&
     	            !_.isNaN(number) &&
     	            _.isFinite(number) &&
     	            number >= 0);
     	}

     	// Validad cantidad de items
     	if (!validNumber(attrs.quantity)) {
     		return 'Invalid quantity';
     	} else if (!validNumber(attrs.price) &&
     			   attrs.item.get('price') === -1) {
     		return 'Invalid price';
     	}
    }
});
