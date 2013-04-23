window.alibelTPV.templates.ItemEdit = '\n\
    <label for="code">Código</label><input type="text" name="code" value="<%= code %>" />\n\
    <label for="name">Nombre</label><input type="text" name="name" value="<%= name %>" />\n\
    <label for="price">Precio</label><input type="number" name="price" value="<%= price %>" />\n\
    <fieldset>\n\
        <legend>Stock</legend>\n\
        <label for="unit">Unidad (singular)</label><input type="text name="unit" value="<%= unit %>" />\n\
        <label for="units">Unidad (plural)</label><input type="text" name="units" value="<%= units %>" />\n\
        <label for="stock">Stock</label><input type="number" name="stock" value="<%= stock %>" />\n\
        <label for="minStock">Stock mínimo</label><input type="number name="minStock" value="<%= minStock %>" />\n\
        <label for="maxStock">Stock máximo</label><input type="number" value="<%= maxStock %>" />\n\
    </fieldset>\n\
    \n\
    <input type="button" class="acceptButton" name="accept" value="Aceptar" />\n\
    <input type="button" class="cancelButton" name="cancel" value="Cancelar" />\n\
';
