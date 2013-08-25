define(["views/projectview"], function(ProjectView) {
	return Backbone.View.extend({
		el: $("#projectList"),
		tagName: "div",
		letterTemplate: _.template('<span class="badge"><%- letter %></span>'),
		initialize: function() {
			this.listenTo(this.collection, "sync", this.render);
		},
		render: function() {
			if(!this.rendered) {
				this.$el.empty();
				var letter = null;
				var prev = null;
				this.collection.forEach(function(project) {
					if(letter != project.get("name").substr(0,1).toUpperCase()) {
						letter = project.get("name").substr(0,1).toUpperCase();
						this.$el.append(this.letterTemplate({letter : letter}));

						if(prev) prev.addClass("last");
					}
					prev = new ProjectView({model: project})
					           .render().$el
					           .appendTo(this.$el);

				}, this);
				this.rendered = true;
			}

			return this;
		}
	});
});