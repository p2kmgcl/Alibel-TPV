/**
 * Vista dedicada a realizar nuevas ventas.
 */
alibel.views.sections.NewSell = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionNewSell',
    template: _.template(alibel.templates.sections.NewSell),
    
    initialize: function () {
        $('body').append(this.el);
    }
});
