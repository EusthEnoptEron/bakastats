define([], function() {
	return Backbone.View.extend({
		tagName: "li",
		className: "list-group-item project",
		template: _.template(
			'<span class="badge pull-left color-indicator" data-color="<%- color %>"></span>&nbsp;<span class="title"><%- name %></span>\
			<button class="close" type="button">x</button>'
		),
		// closedTemplate: _.template(
		// 	'<span class="badge pull-left color-indicator" data-toggle="tooltip"></span>\&nbsp;'
		// ),
		events: {
			"show.bs.collapse": "onShow",
			"click .close": "close",
			"slideStop": function() {
				this.$el.find(".my-slider").trigger("change");
			},
			"changeColor": function(e) {
				this.model.set("color", e.color.toHex());
			},
			"show": function(e) {
				$(e.target).colorpicker("setValue", $(e.target).data("color"));
			}
		},
		bindings: {
			'.badge': {
				observe: 'color',
				update: function($el, val) {
					$el.css("background-color", val)
						.data("color", val);
				}
			},
			".my-slider": "width"
		},
		initialize: function() {
			// this.listenTo(this.model, "change:selected", this.toggleVisibility);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			if(this.model.get("selected"))
				this.$el.show();
			else
				this.$el.hide();
			
			this.$el.find(".color-indicator")
				.colorpicker()
				.tooltip({
					placement: "left",
					title: this.model.get("name")
				});
			
			this.stickit();

			return this;
		},

		close: function() {
			this.model.set("selected", false);
		},
		toggleVisibility: function(model, selected) {
			if(selected) this.$el.show();
			else this.$el.hide();
		}
	});
});