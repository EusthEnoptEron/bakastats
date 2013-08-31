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
		},
		getShortName: function() {
			// Get shortest variant
			var name = this.get("name");
			_.forEach(this.get("aliases"), function(a) {
				if(a.length < name.length) name = a;
			});

			nameParts = name.split(" ");
			name = nameParts.shift();
			while(!this.isUnique(name)) {
				name += " " + nameParts.shift();
			}

			return name;
		},
		is: function(name) {
			var names = [this.get("name")].concat(this.get("aliases"));

			for(var i = 0; i < names.length; i++) {
				if(names[i].indexOf(name) === 0) return true;
			}
		},
		isUnique: function(name) {
			return this.collection.every(function(project) {
				return project === this || !project.is(name);
			}, this);
		}
	});
});