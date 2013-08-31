define([], function() {
	return Backbone.Router.extend({
		initialize: function(options) {
			this.collection = options.collection;
		},
		routes: {
			"(:projects)" : "updateProjects"
		},
		updateProjects: function(projects) {
			if(!projects) {
				this.navigate("Utsuro", {trigger: true});
				return false;
			}
			// Update collection with right projects.
			_.forEach(projects.split("-vs-"), function(name) {
				name = name.replace(/\+/g, " ");
				this.collection.every(function(project) {
					if(project.is(name)) {
						project.set("selected", true);
						return false;
					}
					return true;
				});
			}, this);
		},
		updateUrl: function() {
			// Update url with correct projects.
			var uri = _.map(this.collection.where({selected: true}), function(project) {
				return project.getShortName().replace(/ /g, "+");
			}).join("-vs-");

			this.navigate(uri);
		}
	});
});