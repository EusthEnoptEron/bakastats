define(["views/projectview"], function(ProjectView) {
	return Backbone.View.extend({
		el: $("#search"),
		tagName: "div",
		letterTemplate: _.template('<span class="badge"><%- letter %></span>'),
		events: {
			"typeahead:selected": "selectProject",
			"keydown input": function(e) {
				if(e.which == 13) {
					var project = this.collection.filter(function(project) {
						if(project.get("selected")) return false;
						
						return project.get("name") ==  e.target.value
						 || _.contains(project.get("aliases"), e.target.value);
					});

					if(project.length == 1) {
						this.selectProject(e, project[0]);
					}
				}
			}
		},
		initialize: function() {
			this.listenToOnce(this.collection, "sync", this.render);
			this.listenTo(this.collection, "change:selected", this.updateTypeahead);
			this.input = this.$el.find("#searchInput");
		},
		updateTypeahead: function() {
			this.input.typeahead("destroy");
			this.input.typeahead({
				valueKey: "name",
				local: this.collection.getNames()
			});
		},
		render: function() {
			this.updateTypeahead();
			// if(!this.rendered) {
			// 	this.$el.empty();
			// 	var letter = null;
			// 	var prev = null;
			// 	this.collection.forEach(function(project) {
			// 		if(letter != project.get("name").substr(0,1).toUpperCase()) {
			// 			letter = project.get("name").substr(0,1).toUpperCase();
			// 			this.$el.append(this.letterTemplate({letter : letter}));

			// 			if(prev) prev.addClass("last");
			// 		}
			// 		prev = new ProjectView({model: project})
			// 		           .render().$el
			// 		           .appendTo(this.$el);

			// 	}, this);
			// 	this.rendered = true;
			// }

			return this;
		},
		selectProject: function(e, project) {
			this.collection.get(project.id).set("selected", true);
			this.input.typeahead("setQuery", "").focus();
		}
	});
});