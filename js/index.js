require.config({
	baseUrl: "assets/js"
});
require([
	"collections/projectlist",
	"models/project",
	"views/projectsview",
	"views/chartview",
	"views/sidebar"
], function(ProjectList, Project, ProjectsView, ChartView, Sidebar) {

	// Create models
	var projects = new ProjectList(),
		projectView  = new ProjectsView({
			collection: projects
		}),
		sidebar  = new Sidebar({
			collection: projects
		}),
		chart = new ChartView({
			collection: projects
		});


	// Load data
	projects.fetch();
});