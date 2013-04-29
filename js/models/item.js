/**
 * Contiene todos los datos de un ítem del proyecto.
 * @type {Backbone.Model}
 */
alibel.models.Item = Backbone.Model.extend({
    defaults: {
        "code": 0,
        "name": '',
        "price": 0,
        "unit": 'unidad',
        "units": 'unidades',
        "stock": 0,
        "minStock": 1,
        "maxStock": Infinity
    },

    // Inicializa el item
    initialize: function () {
        // Activa la comprobación de errores
        this.on('invalid', this.throwError, this);
        var error = this.validate(this.attributes);
        if (typeof error !== 'undefined') {
            this.trigger('invalid', this, error);
        }
    },

    /**
     * Lanza el error pasado para que sea tratado externamente.
     * @param  {alibel.models.Item} model [description]
     * @param  {string} error Error ocurrido
     * @return {alibel.models.Item} a sí mismo
     */
    throwError: function (model, error) {
        throw new alibel.error(error, 'alibel.models.Item');
        return this;
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
        } else if (!validNumber(parseInt(attrs.stock))) {
            return 'Invalid stock';
        } else if (!validNumber(parseInt(attrs.minStock))) {
            return 'Invalid minStock';
        }
        
        // Excepción: el stock máximo sí puede ser infinito.
        // Además se permite que el usuario escriba una cadena
        // vacía en lugar del término "Infinity"
        if (attrs.maxStock === '' || attrs.maxStock === ' ') {
            attrs.maxStock = Infinity;
        }
        if (!validNumber(parseInt(attrs.maxStock)) && attrs.maxStock !== Infinity) {
            return 'Invalid maxStock';
        }
    }
});
