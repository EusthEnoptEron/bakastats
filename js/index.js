(function() {
	//http://stackoverflow.com/questions/2161159/get-script-path
	var scriptPath = $("script[src]").last().attr("src").split('?')[0].split('/').slice(0, -1).join('/')+'/';

	require.config({
		baseUrl: "assets/js",
		paths: {
			"components" : "../components",
			'moment': '../components/momentjs/moment'
		}
	});
	require([
		"collections/projectlist",
		"models/project",
		"views/projectsview",
		"views/chartview",
		"views/sidebar",
		"routers/projectsrouter"
	], function(ProjectList, Project, ProjectsView, ChartView, Sidebar, Router) {

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

		projects.once("sync", function() {
			var router = new Router({ collection: projects });
			Backbone.history.start({pushState: true, root: getRoot()});

			projects.on("change:selected", _.bind(router.updateUrl, router));
		});
	});


	function getRoot() {
		return scriptPath.replace(/\/assets\/.+$/, "");
	}
})();