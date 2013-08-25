define(["models/project"], function(Project) {
	return Backbone.Collection.extend({
		model: Project,
		url: "projects",
		comparator: "name"
	});
});