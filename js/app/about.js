/**
 * Vista de la sección acerca de
 */
alibel.app.About = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionAbout',
    template: _.template(alibel.templates.About),

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(
            this.template(alibel.metadata));
    }
});
