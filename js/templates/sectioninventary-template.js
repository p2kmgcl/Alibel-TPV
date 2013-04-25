alibel.templates.sections.Inventary = '\
    <form id="inventaryMenu">\n\
        <input type="search" id="inventarySearch" placeholder="Escribe el nombre de un ítem o su código..." />\n\
        <input type="radio" name="inventaryFilter" id="inventaryFilterAll" /><label for="inventaryFilterAll">Todos</label>\n\
        <input type="radio" name="inventaryFilter" id="inventaryFilterLowStock" /><label for="inventaryFilterLowStock">Stock bajo</label>\n\
        <input type="radio" name="inventaryFilter" id="inventaryFilterNoStock" /><label for="inventaryFilterNoStock">Sin stock</label>\n\
    </form>\n\
    <ul id="inventaryItemList"></ul>\n\
';
