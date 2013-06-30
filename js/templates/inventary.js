alibel.templates.Inventary = '\
    <header>\
        <h1 class="sectionTitle"><%= __("inventary") %></h1>\
        <form class="itemSearch">\
            <input type="search" id="inventaryItemSearch"\
                placeholder="<%= __("writeItemCodeOrName") %>" />\
            <fieldset class="stockFilter">\
                <input type="radio" name="stock" id="inventaryItemStockAll" value="all" />\
                <label for="inventaryItemStockAll"><%= __("all") %></label>\
                <input type="radio" name="stock" id="inventaryItemStockLow" value="lowStock" />\
                <label for="inventaryItemStockLow"><%= __("lowStock") %></label>\
                <input type="radio" name="stock" id="inventaryItemStockNone" value="noStock" />\
                <label for="inventaryItemStockNone"><%= __("noStock") %></label>\
            </fieldset>\
        </form>\
    </header>\
';
