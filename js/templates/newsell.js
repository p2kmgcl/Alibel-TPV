alibel.templates.NewSell = '\
    <header>\
        <h1 class="sectionTitle">Nueva venta</h1>\
        <form class="itemSearch">\
            <input type="search" id="newSellItemSearch"\
                placeholder="Escribe el código o nombre de un ítem"\
                autocomplete="off" />\
        </form>\
    </header>\
    <form class="newSellEnd">\
        <button type="button" id="newSellComplete" class="ui-state-highlight">\
            <i class="icon-ok-sign"></i>\
            <span>Completar</span>\
        </button>\
        <button type="button" id="newSellCancel" class="ui-state-error">\
            <i class="icon-remove-sign"></i>\
            <span>Cancelar</span>\
        </button>\
    </form>\
';
