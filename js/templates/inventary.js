alibel.templates.Inventary = '\
    <header>\
        <h1 class="sectionTitle"><%= __("inventary") %></h1>\
        <form class="itemSearch">\
            <input type="search" id="inventaryItemSearch"\
                placeholder="<%= __("writeItemCodeOrName") %>" />\
            <%= alibel.templates.KeyboardQwerty %>\
        </form>\
        <form class="stockFilter"><fieldset>\
            <legend><%= __("filterItemsByStock") %></legend>\
            <input type="radio" name="stock" id="inventaryItemStockAll" value="all" checked="true" />\
            <label for="inventaryItemStockAll"><i class="icon-star"></i> <span><%= __("all") %></span></label>\
            <input type="radio" name="stock" id="inventaryItemStockLow" value="lowStock" />\
            <label for="inventaryItemStockLow"><i class="icon-star-half"></i> <span><%= __("lowStock") %></span></label>\
            <input type="radio" name="stock" id="inventaryItemStockNone" value="noStock" />\
            <label for="inventaryItemStockNone"><i class="icon-star-empty"></i> <span><%= __("noStock") %></span></label>\
        </fieldset></form>\
        <form class="inventaryEdit"><fieldset>\
            <legend><%= __("editExistingItems") %></legend>\
            <button id="inventaryUpdateButton"><i class="icon-cloud-download"></i> <span><%= __("updateInventary") %></span></button>\
            <button id="inventaryAddNewItemButton"><i class="icon-plus-sign"></i> <span><%= __("addNewItem") %></span></button>\
        </form>\
    </header>\
';
