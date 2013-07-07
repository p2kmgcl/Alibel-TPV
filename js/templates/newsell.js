alibel.templates.NewSell = '\
    <header>\
        <h1 class="sectionTitle"><%= __("newSell") %></h1>\
        <form class="itemSearch">\
            <input type="search" id="newSellItemSearch"\
                placeholder="<%= __("writeItemCodeOrName") %>"\
                autocomplete="off" />\
        </form>\
        <%= alibel.templates.KeyboardQwerty %>\
    </header>\
    <form class="newSellEnd">\
        <button type="button" id="newSellComplete" class="ui-state-highlight">\
            <i class="icon-ok-sign"></i>\
            <span><%= __("completeSell") %></span>\
        </button>\
        <button type="button" id="newSellCancel" class="ui-state-error">\
            <i class="icon-remove-sign"></i>\
            <span><%= __("cancelSell") %></span>\
        </button>\
    </form>\
';
