/**
 * Contiene todos los datos de un item almacenado en el inventario
 * @type {Backbone.Model}
 */
alibel.models.Item = Backbone.Model.extend({
	defaults: {
		code: '',
		name: '',
		price: 0,
        unit: 'unidad',
        units: 'unidades',
		stock: 0,
		minStock: 1,
		maxStock: Infinity
	},
    
    // Inicializa el ítem
    initialize: function () {
        this.on('error', this.throwError, this);
    },
    
    /**
     * Básicamente lanza el error ocasionado
     * @param {Backbone.Model} model Modelo en el que se ha producido el error
     * @param {string} message Descripción del error
     */
    throwError: function (model, message) {
        throw new Error(model, message);
    },
    
    /**
     * Comprueba que los atributos pasados al ítem cumplen todas las condiciones
     * establecidas.
     * @param {object} attrs Objeto con los atributos del ítem que van
     *  a comprobarse.
     */
    validate: function (attrs) {
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
        
        /**
         * Checkea si la cadena cumple las siguientes condiciones:
         *  - Ser una cadena
         *  - No ser la cadena vacía
         *  - No se la cadena con un espacio
         * @param {string} string cadena que se comprobará
         */
        function validString (string) {
            return (_.isString(string) &&
                    string !== '' &&
                    string !== ' ');
        }
        
        // Finalmente valida todos los atributos
        if (!validNumber(parseInt(attrs.code))) {
            return 'Invalid code';
        } else if (!validString(attrs.name)) {
            return 'Invalid name';
        } else if (!validNumber(parseFloat(attrs.price))) {
            return 'Invalid price';
        } else if (!validString(attrs.unit)) {
            return 'Invalid unit';
        } else if (!validString(attrs.units)) {
            return 'Invalid units';
        } else if (!validNumber(attrs.stock)) {
            return 'Invalid stock';
        } else if (!validNumber(attrs.minStock)) {
            return 'Invalid minStock';
        
        // Excepción: el stock máximo sí puede ser infinito
        } else if (!validNumber(attrs.maxStock) && attrs.maxStock !== Infinity) {
            return 'Invalid maxStock';
        }
    }
});
