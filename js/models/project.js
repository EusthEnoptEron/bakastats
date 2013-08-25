define([], function() {
	// Project
	return Backbone.Model.extend({
		defaults: {
			name: "",
			data: null,
			selected: false,
			color: "#CCCCCC",
			width: 1
		},
		hasLoaded: function() {
			return this.get("data");
		}
	});
});