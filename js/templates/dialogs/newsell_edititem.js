alibel.templates.ItemCartDialog = '\
    <label for="itemCartDialogName"><%= __("name") %></label>\
    <span class="name"><%= name %></span>\
    \
    <label for="itemCartDialogQuantity" class="quantity"><%= __("quantity") %></label>\
    <input type="number" min="0" max="<%= maxQuantity %>" step="1" value="<%= quantity %>" id="itemCartDialogQuantity" />\
    <span class="quantityUnit"><%= units.toLowerCase() %></span>\
    \
    <label for="itemCartDialogPrice" class="price"><%= __("price") %></label>\
    <input type="number" min="0" value="<%= price.toFixed(2) %>" step="0.05" id="itemCartDialogPrice" />\
    <span class="priceUnit">€ / <%= unit.toLowerCase() %></span>\
    \
    <label for="id="itemCartDialogFinalPrice"><%= __("totalPrice") %></label>\
    <span class="finalPrice" id="itemCartDialogFinalPrice"><%= (quantity * price).toFixed(2) %></span>\
';
