define([], function() {
	return Backbone.View.extend({
		tagName: "a",
		className: "projectlink",
		attributes: {
			href: "#"
		},
		template: _.template("<%- name %>"),
		events: {
			"click": "toggleSelection"
		},
		initialize: function() {
			this.listenTo(this.model, "change:selected", function(m, selected) {
				this.$el.toggleClass("selected", selected);
			});
			this.listenTo(this.model, "change:color", function(m, color) {
				this.$el.css("color", color);
			});
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		toggleSelection: function() {
			this.model.set("selected", !this.model.get("selected"));
			return false;
		}
	});
});