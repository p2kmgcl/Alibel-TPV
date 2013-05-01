alibel.test = {
    /**
     * Inicia el test
     */
    init: function () {
        console.group('Starting Alibel TPV test');
        console.time('alibelTest');
        alibel.test.start();
        console.timeEnd('alibelTest');
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
        app: {
            History: {
                creating: function () {
                    var sc = new alibel.collections.ShoppingCart([
                            {date: new Date('1991-10-1')},
                            {date: new Date('1991-10-19')},
                            {date: new Date()}
                        ]),
                        scv = new alibel.views.ShoppingCartCollection({ collection: sc });
                        h = new alibel.app.History({
                            shoppingCartCollection: scv
                        });
                    
                    return true;
                }
            },

            Inventary: {
                creating: function () {
                    var ic = new alibel.collections.Item([
                            { name: 'Item 1', code: 1 },
                            { name: 'Item 2', code: 2 },
                            { name: 'Item 3', code: 3 },
                            { name: 'Item 4', code: 4 }
                        ]),
                        icv = new alibel.views.ItemCollection({
                            collection: ic
                        }),
                        inv = new alibel.app.Inventary({
                            itemCollection: icv
                        });

                    return true;
                }
            }
        },

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
            },

            ShoppingCart: {
                // Comprueba que el filtro de fechas es correto
                filtering: function () {
                    var d1991_10_1 = new Date('1991-10-1'),
                        d1991_10_5 = new Date('1991-10-5'),
                        d1991_10_19 = new Date('1991-10-19'),
                        dtoday = new Date(),
                        sc = new alibel.collections.ShoppingCart([
                            { date: d1991_10_1, id: 1},
                            { date: d1991_10_19, id: 2},
                            { date: dtoday, id: 3}]),

                        r = function (arr) {
                            var ids = [];
                            for (var i = 0; i < arr.length; i++) {
                                ids.push(arr[i].get('id'));
                            }
                            var text = arr.length + ' -> ' + ids.join(',');
                            return text;
                        };
                    
                    if (r(sc.filterByDate(d1991_10_5)) !== '2 -> 2,3' ||
                        r(sc.filterByDate(d1991_10_1)) !== '3 -> 1,2,3' ||
                        r(sc.filterByDate(dtoday)) !== '1 -> 3'
                        )
                        return false;

                    return true;
                }
            }
        },

        models: {
            Item: {
                validPrice: function () {
                    var i = new alibel.models.Item({ name: 'item' });
                    return alibel.test.tools.checkParams(function (number) {
                        i.set('price', number, { validate: true });
                    }, [-1, -Infinity, Infinity, NaN, undefined], [0, 1, 1.1]);
                },

                validMaxStock: function () {
                    var i = new alibel.models.Item({ name: 'item' });
                    return alibel.test.tools.checkParams(function (number) {
                        i.set('maxStock', number, { validate: true });
                    }, [-1, -Infinity, NaN, undefined], [Infinity, 0, 1, 1.1]);
                }
            },

            ShoppingCart: {
                // Si añade dos veces el mismo item solo suma unidades
                itemTwice: function () {
                    var s = new alibel.models.ShoppingCart(),
                        i = new alibel.models.Item({
                            name: 'item',
                            code: 1001
                        });

                    s.add(i, 10)
                     .add(i, 5);

                    return (s.get('items').at(0).get('quantity') === 15) ?
                                true : false;
                }
            }
        },

        views: {
            ShoppingCart: {
                creating: function () {
                    var s = new alibel.models.ShoppingCart(),
                        sv = new alibel.views.ShoppingCart({
                        model: s
                    });
                    return true;
                },

                addItems: function () {
                    var s = new alibel.models.ShoppingCart(),
                        sv = new alibel.views.ShoppingCart({
                            model: s
                        })
                        i1 = new alibel.models.Item({
                            name: 'Gato lindo',
                            code: 13,
                            price: 13.33
                        }),
                        i2 = new alibel.models.Item({
                            name: 'Gato bello',
                            code: 123,
                            price: 12.25
                        });

                    s.add(i1, 10)
                     .add(i2, 5, 6);
                    return true;
                }
            },

            ShoppingCartCollection: {
                create: function () {
                    var d1991_10_1 = new Date('1991-10-1'),
                        d1991_10_5 = new Date('1991-10-5'),
                        d1991_10_19 = new Date('1991-10-19'),
                        dtoday = new Date(),
                        sc = new alibel.collections.ShoppingCart([
                            { date: d1991_10_1, id: 1},
                            { date: d1991_10_19, id: 2},
                            { date: dtoday, id: 3}]),
                        scv = new alibel.views.ShoppingCartCollection({
                            collection: sc
                        });
                    return true;
                },

                filterByDate: function () {
                    var d1991_10_1 = new Date('1991-10-1'),
                        d1991_10_5 = new Date('1991-10-5'),
                        d1991_10_19 = new Date('1991-10-19'),
                        dtoday = new Date(),
                        sc = new alibel.collections.ShoppingCart([
                            { date: d1991_10_1, id: 1},
                            { date: d1991_10_19, id: 2},
                            { date: dtoday, id: 3}]),
                        scv = new alibel.views.ShoppingCartCollection({
                            collection: sc
                        });

                    scv.filterByDate(d1991_10_1, d1991_10_19);
                    scv.filterByDate(dtoday);
                    return true;
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