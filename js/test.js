alibel.test = {
    /**
     * Inicia el test
     */
    init: function () {
        console.group('Starting Alibel TPV test');
        alibel.test.start();
        console.groupEnd();
    },

    /**
     * Ejecuta todo el test, recorriendo el subobjecto tests
     * @param  {object} scaff Nivel en el que se encuentra actualmente
     * @param  {string} name  Nombre del nivel
     */
    start: function (scaff, name) {
        var deep = scaff || alibel.test.tests,
            name = name || [];

        for (var x in deep) {
            name.push(x);
            console.group(name.join('.'));

            if (typeof deep[x] === 'function') {
                alibel.test.tools.makeTest(deep[x], name.join('.'));
            } else {
                alibel.test.start(deep[x], name);
            }

            console.groupEnd();
            name.pop();
        }
    },

    tools: {
        /**
         * Ejecuta el test pasado con el nombre pasado
         * @param  {function} test Función del test
         * @param  {string} name Nombre del test
         */
        makeTest: function (test) {
            (!test()) ?
                console.error('⨯\n'):
                console.log('✔\n');
        },

        /**
         * Ejecuta todos los parámetros pasados con la función fn.
         * Si se lanzan errores con los parámetros malos se considera
         * que todo está correcto y al revés con parámetros buenos.
         * Pasar parámetros buenos es opcional.
         * @param  {Function} fn Función que ejecutará todos los parámetros
         * @param  {array}   badParams  Parámetros que deben fallar
         * @param  {array}   goodParams Parámetros que no deben fallar
         * @return {boolean} false si ocurre algún error, true si todo funciona correctamente
         */
        checkParams: function (fn, badParams, goodParams) {
            console.groupCollapsed('Checking params');
            for (var i = 0; i < badParams.length; i++) {
                console.log('(-) ' + badParams[i]);
                try {
                    fn(badParams[i]);
                    return false;
                } catch (e) {}
            }

            if (goodParams) {
                 for (var i = 0; i < goodParams.length; i++) {
                    console.log('(+) ' + goodParams[i]);
                    try {
                        fn(goodParams[i]);
                    } catch(e) {
                        return false;
                    }
                 }
            }
            console.groupEnd();

            return true;
        }
    },

    // Este es el conjunto de tests que van a ejecutarse
    tests: {
        collections: {
            Item: {
                // Ítems con código único
                checkUnique: function () {
                    var ic = new alibel.collections.Item();
                    try {
                        ic.add({ name: 'Item1'
                        }).add({ name: 'Item2' });                    
                    } catch(e) {
                        ic.add({ name: 'Item3', code: 3
                        }).add({ name: 'Item4', code: 4 });
                        return true;
                    }
                }
            }
        },

        models: {
            Item: {
                validPrice: function () {
                    var i = new alibel.models.Item({ name: 'item' });
                    return alibel.test.tools.checkParams(function (number) {
                        result = i.set('price', number, { validate: true });
                    }, [-1, -Infinity, Infinity, NaN, undefined], [0, 1, 1.1]);
                },

                validMaxStock: function () {
                    var i = new alibel.models.Item({ name: 'item' });
                    return alibel.test.tools.checkParams(function (number) {
                        result = i.set('maxStock', number, { validate: true });
                    }, [-1, -Infinity, NaN, undefined], [Infinity, 0, 1, 1.1]);
                }
            }
        }
    }
};

$(function () {
    if (alibel.metadata.development) {
        alibel.test.init();
    }
}());