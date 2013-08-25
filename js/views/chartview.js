define([], function() {
	return Backbone.View.extend({
		el: $("#chart"),
		tagName: "div",
		initialize: function() {
			
			// console.log(this.chart);
			this.listenTo(this.collection, "change:selected", this.onSelectionChange);
			this.listenTo(this.collection, "change:color", this.onChange);
			this.listenTo(this.collection, "change:width", this.onChange);

		},
		onSelectionChange: function(project, selected) {
			
			if(!project.loading && selected) {
				project.loading = true;

				project.fetch();

				this.listenTo(project, "change:data", this.onLoaded);			
			} else if(project.loading && !selected) {
				var series = this.chart.get(project.id);
				if(series) series.remove();
			}
		},
		onLoaded: function(project, data) {
			if(project.get("selected")) {
				var options = {
					data: data,
					id: project.id,
					name: project.get("name")
				};

				if(!this.chart) 
					this.initChart(options);
				else 
					this.chart.addSeries(options);

				project.set("color", this.chart.get(project.id).color);
			}
		},
		initChart: function(series) {
			this.chart = new Highcharts.StockChart({
			    chart: {
			        renderTo: this.el
			    },
			    title: {
			        text: 'Baka-Tsuki Total Views'
			    },
			    rangeSelector: {
			        selected: 4
			    },
			    xAxis: {
		        	type: 'datetime'
			    },
			    yAxis: {
			        title: {
	                    text: 'PVs'
	                },
	                min: 0
			    },
			    series: [series]
			});
		},
		onChange: function(project) {
			var series;

			if(series = this.chart.get(project.id)) {
				var options = {};
				_.forEach(project.changed, function(val, attr) {
					switch(attr) {
						case "color":
							options.color = val;
							break;
						case "width":
							options.lineWidth = val;
							break;
						default:
							break;
					}
				});
				series.update(options);
			}
		}
	});
});