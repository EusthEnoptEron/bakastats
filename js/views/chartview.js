define(["moment"], function(moment) {

	// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
	function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	return Backbone.View.extend({
		el: $("#chart"),
		tagName: "div",
		initialize: function() {
			this.baseSeries;

			// console.log(this.chart);
			this.listenTo(this.collection, "change:selected", this.onSelectionChange);
			this.listenTo(this.collection, "change", this.onChange);
			this.listenToOnce(this.collection, "sync", function(collection) {
				_.forEach(collection.where({ "selected" : true }), function(model) {
					this.onSelectionChange(model, true)
				}, this);
			});

			var that = this;
			$(window).on("resize", function() { that.resize() } );
			
			this.resize();
		},
		onSelectionChange: function(project, selected) {
			if(!project.loaded && selected) {
				project.loaded = true;

				project.fetch();

				this.listenTo(project, "change:data", this.onLoaded);			
			} else if(project.loaded && selected && !this.chart.get(project.id)) {
				this.onLoaded(project, project.get("data"));
			} else if(project.loaded && !selected) {
				this.removeSeries(project.id);
				this.removeSeries(project.id + "_flags");
			}
		},
		removeSeries: function(id) {
			var series = this.chart.get(id);
			if(series) series.remove();
		},
		onLoaded: function(project, data) {
			if(project.get("selected")) {
				// data = _.filter(data, function(val, i) {
				// 	return i%4 == 0;
				// });

				var options = {
					data: data,
					id: project.id,
					name: project.get("name"),
					type: 'spline'
				};

				if(!this.chart) {
					this.initChart(options);
				} else {
					this.chart.addSeries(options);

					if(!this.baseSeries.length ||
						(data.length && data[0][0] < this.baseSeries[0][0])) {
	
						this.chart.series[1].setData(data);
						this.baseSeries = data;
					}
					// if(data.length && data[0][0] <) 

				}

				var labels = project.get("labels");
				if(labels && labels.length) {
					this.chart.addSeries({
						id: project.id + "_flags",
						type: "flags",
						onSeries: project.id,
						data: labels
					});
				}


				project.set("color", this.chart.get(project.id).color);
			}
		},
		initChart: function(series) {
			var from = getParameterByName("from");
			var to = getParameterByName("to");
			
			
			if(from) {
				from = moment(from);
			} else {
				from = moment().subtract("month", 3).startOf("month");
			}
			console.log(to);
			if(to) {
				to = moment(to);
			} else {
				to = moment();
			}

			
			this.chart = new Highcharts.StockChart({
			    chart: {
			        renderTo: this.el,
			        type: "spline",
			        zoomType: 'x'
			    },
			    title: {
			        text: 'Baka-Tsuki Total Views'
			    },

			    navigator: {
			    	baseSeries: 0
			    },
			    plotOptions: {
			    	spline: {
			    		marker: {
			    			enabled: false
			    		}
			    	}
			    },
			    xAxis: {
		        	type: 'datetime',
		        	min: from.format("X") * 1000,
		        	max: to.format("X") * 1000
			    },
			    yAxis: {
			        title: {
	                    text: 'PVs'
	                },
	                min: 0
			    },
			    series: [series]
			});
			this.baseSeries = series.data;
		},
		onChange: function(project) {
			var series;
			if(!this.chart) return;
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
				clearTimeout(this.timeout);
				this.timeout = setTimeout(_.bind(function() {
					series.update(options);
				}, this), 100);
			}
		},
		resize: function() {
			this.$el.css("height", $(window).height() + "px");
		}
	});
});