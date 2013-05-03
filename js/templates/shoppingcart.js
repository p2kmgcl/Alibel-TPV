alibel.templates.ShoppingCart = '\
    <header>\
        <time><%= alibel.formatDate(date) %></time>\
        <span class="totalPrice price"><%= totalPrice.toFixed(2) %></span>\
        <span class="totalItems"><%= totalItems %></span>\
    </header>\
    <ul class="itemList"></ul>\
';
