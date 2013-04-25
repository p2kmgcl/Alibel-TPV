/**
 * Vista utilizada para renderizar la sección acerca de.
 */
alibel.views.sections.About = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionAbout',
    template: _.template(alibel.templates.sections.About),
    
    initialize: function () {
        $('body').append(this.el);
        this.render();
    },
    
    render: function () {
        this.$el.html(this.template(alibel.metadata));
    }
});
