define(["models/project"], function(Project) {
	function makeDatum(project) {
		return {
			"name": project.get("name"),
			"id"  : project.id
		};
	}

	return Backbone.Collection.extend({
		model: Project,
		url: "projects",
		comparator: "name",

		getNames: function() {
			var names = [];

			_.forEach(this.where({selected: false}), function(project) {
				names.push({
					name: project.get("name"),
					id  : project.id
				});

				if(project.get("aliases")) {
					// console.log("LABELS");
					_.forEach(project.get("aliases"), function(alias) {
						names.push({
							name: alias,
							id: project.id
						});
					});
				}
			});
			return names;
		}
	});
});