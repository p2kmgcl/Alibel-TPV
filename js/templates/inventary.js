alibel.templates.Inventary = '\
    <header>\
        <h1 class="sectionTitle">Inventario</h1>\
        <form class="itemSearch">\
            <input type="search" id="inventaryItemSearch"\
                placeholder="Escribe el código o nombre de un ítem" />\
            <fieldset class="stockFilter">\
                <input type="radio" name="stock" id="inventaryItemStockAll" value="all" />\
                <label for="inventaryItemStockAll">Todos</label>\
                <input type="radio" name="stock" id="inventaryItemStockLow" value="lowStock" />\
                <label for="inventaryItemStockLow">Stock bajo</label>\
                <input type="radio" name="stock" id="inventaryItemStockNone" value="noStock" />\
                <label for="inventaryItemStockNone">Sin stock</label>\
            </fieldset>\
        </form>\
    </header>\
';
