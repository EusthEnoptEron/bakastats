define([], function() {
	return Backbone.View.extend({
		tagName: "div",
		className: "project panel panel-default",
		template: _.template(
			'<div class="panel-heading">\
				<a class="accordion-toggle" data-toggle="collapse" data-parent="#sidebar" href="#p<%- id %>">\
					<span class="badge pull-right" data-color="<%- color %>">&nbsp;</span><%- name %>\
				</a>\
			</div>\
			<div id="p<%- id %>" class="panel-collapse collapse">\
				<div class="panel-body">\
					<form class="form-horizontal">\
					  <div class="form-group">\
					    <label for="width<%- id %>" class="col-lg-3 control-label">Width</label>\
					    <div class="col-lg-9">\
					      <input type="text" class="my-slider" value="" data-slider-min="1"">\
					    </div>\
					  </div>\
					</form>\
				</div>\
			</div>'),
		events: {
			"show.bs.collapse": "onShow",
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
			this.listenTo(this.model, "change:selected", this.render);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			if(this.model.get("selected"))
				this.$el.show();
			else
				this.$el.hide();

			this.$el.find(".badge").colorpicker();
			this.stickit();

			return this;
		},
		onShow: function() {
			var that = this;
			setTimeout(function() {
				that.$el.find(".my-slider").slider({
					value: that.model.get("width")
				});

			}, 10);
		}
	});
});