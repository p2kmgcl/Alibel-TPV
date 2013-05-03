alibel.templates.ItemCart = '\
    <li class="code"><%= code %></li>\
    <li class="name"><%= name %></li>\
    <li class="price"><%= price.toFixed(2) %></li>\
    <li class="quantity"><%= quantity %></li>\
    <li class="finalPrice"><%= (price * quantity).toFixed(2) %></li>\
';
