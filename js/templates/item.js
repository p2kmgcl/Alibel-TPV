alibel.templates.Item = '
    <li class="code"><%= code %></li>\
    <li class="name"><%= name %></li>\
    <li class="price"><%= price %></li>\
    <li class="stock"><%= stock %> <% (stock === 1) ? print(unit) : print(units); %></li>\
';
