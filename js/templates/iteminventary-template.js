alibel.templates.Item = '\n\
    <li class="code"><%= code %></li>\n\
    <li class="name"><%= name %></li>\n\
    <li class="price"><%= price %></li>\n\
    <li class="stock"><%= stock %> <% (stock === 1) ? print(unit) : print(units); %></li>\n\
';
