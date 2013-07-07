alibel.templates.CompleteSellDialog = '\
    <label for="completeSellDialogTotal"><%= __("total") %></label>\
    <span class="total"><%= total.toFixed(2) %></span>\
    <span class="totalUnit unit">€</span>\
    \
    <div>\
        <label for="completeSellDialogPaid" class="paid"><%= __("paid") %></label>\
        <input type="number" min="<%= total.toFixed(2) %>" step="0.05" value="<%= total.toFixed(2) %>" id="completeSellDialogPaid" />\
        <span class="paidUnit unit">€</span>\
    </div>\
    \
    <label for="id="completeSellDialogChange"><%= __("change") %></label>\
    <span class="change" id="completeSellDialogChange"><%= (0).toFixed(2) %></span>\
    <span class="changeUnit unit">€</span>\
    <%= alibel.templates.KeyboardNumeric %>\
';
