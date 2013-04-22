/**
 * Vista utilizada para renderizar la sección acerca de.
 */
window.alibelTPV.views.sections.About = Backbone.View.extend({
    tagName: 'section',
    id: 'sectionAbout',
    template: _.template(window.alibelTPV.templates.sections.About),
    
    initialize: function () {
        $('body').append(this.el);
        this.render();
    },
    
    render: function () {
        this.$el.html(this.template(window.alibelTPV.metadata));
    }
});
