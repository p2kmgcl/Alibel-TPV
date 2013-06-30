alibel.templates.App = '\
    <header>\
        <h1>' + alibel.metadata.name + '</h1>\
        <span id="alibelMainClock">\
            <i class="icon-time"></i>\
            <time>13/10/1991 22:00</time>\
        </span>\
    </header>\
    <div class="content">\
        <ul id="mainMenu">\
            <li class="menuOption">\
                <i class="icon-money"></i>\
                <a href="#sectionNewSell"><%= __("newSell") %></a>\
            </li>\
            <li class="menuOption">\
                <i class="icon-bar-chart"></i>\
                <a href="#sectionHistory"><%= __("history") %></a>\
            </li>\
            <li class="menuOption">\
                <i class="icon-book"></i>\
                <a href="#sectionInventary"><%= __("inventary") %></a>\
            </li>\
            <li class="menuOption">\
                <i class="icon-question-sign"></i>\
                <a href="#sectionAbout"><%= __("about") %></a>\
            </li>\
        </ul>\
    </div>\
';
