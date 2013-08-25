define(["views/projectsettings"], function(ProjectSettingsView) {
	return Backbone.View.extend({
		el: $("#sidebar"),
		tagName: "div",
		letterTemplate: _.template('<span class="badge"><%- letter %></span>'),
		initialize: function() {
			this.listenToOnce(this.collection, "sync", this.render);
			// this.listenTo(this.collection, "change:selected", this.render);
		},
		render: function() {
			this.collection.forEach(function(project) {
				this.$el.append((new ProjectSettingsView({
					model: project
				})).render().el);
			}, this);

			return this;
		}
	});
});