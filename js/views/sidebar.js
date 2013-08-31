define(["views/projectsettings"], function(ProjectSettingsView) {
	return Backbone.View.extend({
		el: $("#sidebar"),
		tagName: "ul",
		letterTemplate: _.template('<span class="badge"><%- letter %></span>'),
		events: {
			"click .slide-trigger": "toggle"
		},
		initialize: function() {
			this.listenToOnce(this.collection, "sync", this.render);
			this.listenTo(this.collection, "change:selected", this.render);
			// 
			this.toggle();
		},
		render: function() {
			this.$el.children(".project").remove();

			_.forEach(this.collection.where({ selected: true }), function(project) {
				this.$el.append((new ProjectSettingsView({
					model: project
				})).render().el);
			}, this);

			return this;
		},
		toggle: function() {
			this.toggled = !this.toggled;

			this.$el.find(".slide-trigger span")
				.toggleClass("glyphicon-chevron-left", !this.toggled)
				.toggleClass("glyphicon-chevron-right", this.toggled);

			this.$el.parent().toggleClass("toggled", this.toggled)
				.toggleClass("untoggled", !this.toggled);

			$(window).trigger("resize");
		}
	});
});