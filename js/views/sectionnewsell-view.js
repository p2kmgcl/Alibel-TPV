/**
 * Vista dedicada a realizar nuevas ventas.
 */
window.alibelTPV.views.sections.NewSell = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionNewSell',
    template: _.template(window.alibelTPV.templates.sections.NewSell),
    
    initialize: function () {
        $('body').append(this.el);
    }
});
