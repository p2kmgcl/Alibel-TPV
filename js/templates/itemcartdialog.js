alibel.templates.ItemCartDialog = '\
    <span class="name"><%= name %></span>\
    <label for="itemCartDialogQuantity" class="quantity">Cantidad</label>\
    <input type="number" min="0" max="<%= maxQuantity %>" step="1" value="<%= quantity %>" id="itemCartDialogQuantity" />\
    <label for="itemCartDialogPrice" class="price">Precio</label>\
    <input type="number" min="0" value="<%= price.toFixed(2) %>" step="0.01" id="itemCartDialogPrice"/>\
    <span class="finalPrice" id="itemCartDialogFinalPrice"><%= (quantity * price).toFixed(2) %></span>\
';
