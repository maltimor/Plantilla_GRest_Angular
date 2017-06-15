angular.module('app').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

angular.module('app').directive('inputMode', function(){
	return {
		restrict : 'A',
		scope : {
			inputMode: '='
		},
		controller : function ($scope, $element, $attrs) {
			$scope.$watch('inputMode', function(value) {
				if ($scope.inputMode=='read') $element.attr('disabled','');
				else $element.removeAttr('disabled');
			});
		}
	}
});

angular.module('app').directive('eduPagination', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/dirPagination.tpl.html',
		transclude: false,
		scope : {
			data : '=',
			onChange : '&'
		},
		controller : function($scope, $attrs) {
				
			$scope.setFirstPage = function(){
				$scope.data.setFirstPage();
			}
			
			$scope.setLastPage = function(){
				$scope.data.setLastPage();
			}

			$scope.setNextPage = function(){
				$scope.data.setNextPage();
			}
			
			$scope.setPreviousPage = function(){
				$scope.data.setPreviousPage();
			}

			$scope.isOnFirstPage = function (){
				return $scope.data.isOnFirstPage();
			}
			
			$scope.isOnLastPage = function (){
				return $scope.data.isOnLastPage();
			}
			
			$scope.getCurrent = function (){
				return $scope.data.getCurrent();
			}

			$scope.setCurrent = function(page){
				$scope.data.setCurrent(page);
				$scope.onChange();
			}
		}
	};
});


angular.module('app').directive('eduOverlay', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/dirOverlay.tpl.html',
		transclude: false,
		scope: {
			data:'=',
		},
		controller : function($scope, $timeout, eduOverlayFactory) {
			//if(!eduOverlayFactory.initOverlayObject($scope, $timeout))
			//	$scope.data = eduOverlayFactory.initOverlayObject($scope, $timeout);
			$scope.okButton = function(){
				console.log("OK");
				$scope.data.show=false;
				if ($scope.data.okfunc!==undefined) $scope.data.okfunc();
			}
			$scope.cancelButton = function(){
				console.log("CANCEL");
				$scope.data.show=false;
			}
		}
	};
});

angular.module('app').directive('listControl', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/listControl.tpl.html',
		transclude: false, //opcional
		scope : {
			api : '=',
			overlay : '=',
			btn : '&',
			btnCaption : '@'
		},
		controller : function ($scope) {
			$scope.sortSrc = function(param) {
				$scope.overlay=true;
				$scope.api.setSort(param);
			}

			$scope.changeLimit = function(num) {
				$scope.overlay=true;
				$scope.api.setLimit(num);
			}

			$scope.searchSrc = function() {
				$scope.soverlayhowOverlayLoading=true;
				$scope.api.setFilter($scope.filtro);
			}
			
			$scope.exportExcel = function() {
				$scope.overlay=true;
				$scope.api.exportExcel();
			}
		}
	};
});

angular.module('app').directive('horaControl', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/horaControl.tpl.html',
		transclude: false, //opcional
		scope : {
			result: '=model',
			step: '=',
			read: '='
		},
		controller : function ($scope) {
			$scope.amValue="Mañana";
			$scope.pmValue="Tarde";
			var h=0;
			var m=0;
			
			if ($scope.step===undefined) $scope.step=30;
			
			if ($scope.result!==undefined){
				var r=$scope.result;
				var i=r.indexOf(":");
				if (i!=-1){
					h=parseInt(r.substr(0,i));
					m=parseInt(r.substr(i+1));
				}
			}
			actualizaModelo();

			$scope.add = function(){
				m+=$scope.step;
				if (m>=60){
					m-=60;
					h+=1;
					if (h>=24) h-=24;
				}
				actualizaModelo();
			}
			
			$scope.dec = function(){
				m-=$scope.step;
				if (m<0){
					m+=60;
					h-=1;
					if (h<0) h+=24;
				}
				actualizaModelo();
			}
			
			$scope.ponAm = function(){
				if (h>=12) h-=12;
				actualizaModelo();
			}

			$scope.quitaAm = function(){
				if (h<=12) h+=12;
				if (h>=24) h-=24;
				actualizaModelo();
			}

			function actualizaModelo(){
				$scope.result=pad(h)+":"+pad(m);
				if (h<=12){
					$scope.am=true;
					$scope.value=pad(h)+":"+pad(m);
				} else {
					$scope.am=false;
					$scope.value=pad(h-12)+":"+pad(m);
				}
			}
			
			function pad(a){
				var p="00"+a;
				return p.substr(p.length-2);
			}
		}
	};
});


angular.module('app').directive('semanaControl', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/semanaControl.tpl.html',
		transclude: false, //opcional
		scope : {
			result: '=model',
			read: '='
		},
		controller : function ($scope) {

			$scope.clearPatron = function(){
				$scope.patron = {
					L:false,
					M:false,
					X:false,
					J:false,
					V:false,
					S:false,
					D:false,
					value:0
				};
				$scope.result=0;
			};

			if ($scope.result){
				var r = $scope.result;
				$scope.patron = {
						L: (r&1),
						M: (r&2),
						X: (r&4),
						J: (r&8),
						V: (r&16),
						S: (r&32),
						D: (r&64),
						value: r
				}
			} else $scope.clearPatron();
			
			$scope.patronChanged = function(){
				var p = $scope.patron;
				p.value = (p.L?1:0);
				p.value += (p.M?2:0);
				p.value += (p.X?4:0);
				p.value += (p.J?8:0);
				p.value += (p.V?16:0);
				p.value += (p.S?32:0);
				p.value += (p.D?64:0);
				$scope.result=p.value;
			};
			
			$scope.$watch(function(scope){
				return scope.patron.L+scope.patron.M+scope.patron.X+scope.patron.J+scope.patron.V+scope.patron.S+scope.patron.D;
			},function(){
				$scope.patronChanged();
			});
		}
	};
});


angular.module('app')
.constant('temporadaConfig', {
	temporadas: ["Invierno","Verano","Todo el año"]
})
.directive('temporadaControl', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/temporadaControl.tpl.html',
		transclude: false, //opcional
		scope : {
			result: '=model',
			temporadasAttr: '=temporadas',
			read: '='
		},
		controller : function ($scope,temporadaConfig) {

			if ($scope.temporadasAttr){
				$scope.temporadas=[];
				for(var i=0;i<$scope.temporadasAttr.length;i++){
					$scope.temporadas.push($scope.temporadasAttr[i]);
				}
			} else $scope.temporadas=temporadaConfig.temporadas;
			
			$scope.clearTemporada = function(){
				$scope.temporada={};
				for(var i=0;i<$scope.temporadas.length;i++){
					$scope.temporada[$scope.temporadas[i]]=false;
				}
				$scope.temporada[$scope.temporadas[0]] = true;
				$scope.result=$scope.temporadas[0];
			};

			$scope.click=function(t){
				var existe=false;
				for(var i=0;i<$scope.temporadas.length;i++){
					if (t==$scope.temporadas[i]) existe=true;
					$scope.temporada[$scope.temporadas[i]]=false;
				}
				if (existe) {
					$scope.temporada[t]=true;
					$scope.result=t;
				} else $scope.clearTemporada();
			}

			if ($scope.result!==undefined){
				var r = $scope.result;
				$scope.clearTemporada();
				$scope.click(r);
			} else $scope.clearTemporada();
			
		}
	};
});

angular.module('app').directive('dateTimeFilter', [
                                                  'dateFilter',
                                                  function (dateFilter) {
                                                    return {
                                                      require: 'ngModel',
                                                      link: function (scope, elm, attrs, ngModelCtrl) {
                                                        ngModelCtrl.$formatters.unshift(function (modelValue) {
                                                        	
                                                          return dateFilter(modelValue, 'yyyy-MM-ddTHH:mm');
                                                        });
                                                        ngModelCtrl.$parsers.unshift(function (viewValue) {
                                                          return new Date(viewValue);
                                                        });
                                                      }
                                                    };
                                                  }
                                                ]);
angular.module('app').directive('dateFilter', [
                                           'dateFilter',
                                           function (dateFilter) {
                                             return {
                                               require: 'ngModel',
                                               link: function (scope, elm, attrs, ngModelCtrl) {
                                                 ngModelCtrl.$formatters.unshift(function (modelValue) {
                                                   return dateFilter(modelValue, 'yyyy-MM-dd');
                                                 });
                                                 ngModelCtrl.$parsers.unshift(function (viewValue) {
                                                   return new Date(viewValue);
                                                 });
                                               }
                                             };
                                           }
                                         ]);

angular.module('app').directive('appRegister', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/registros.tpl.html',
		transclude: false, //opcional
		scope : {
			data : '=parametro',
			opt : '=parametro2'
		}
	};
});

angular.module('app').directive('sortT', function(){
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/sort.tpl.html',
		transclude : false,
		scope: {
			opt: '=opt',
			sortparam: '@sortparam',
			sortlabel: '@sortlabel',
			onChange: '&'
		}
	}
});

angular.module('app').directive('grid', function(){
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/grid.tpl.html',
		transclude : false
	}
});

angular.module('app').directive('datos', function(){
	return {
		restrict : 'E',
		templateUrl : 'app/partials/directivas/dirDatos.tpl.html',
		transclude : false,
		scope : {
			id: '=id',
			type: '=type',
			timestamp: '=timestamp',
			source: '=source'
		}
	}
});

angular.module('app').directive('btns', function(){
	return {
		restrict : 'AEC',
		templateUrl : 'app/partials/directivas/btnsVer.tpl.html',
		transclude : false,
		scope : {
			mrender: '=',
			mcodigo: '=',
			mMayu: '='
		}, 
		controller: function($scope){
			// alert($scope.mrender);
			// $scope.mrender = true;
			$scope.mrenderT = 'Ocultar render';
			$scope.mrenderC = 'glyphicon glyphicon-eye-close';
			// $scope.mcodigo = true;
			$scope.mcodigoT = 'Ocultar codigo';
			$scope.mcodigoC = 'glyphicon glyphicon-eye-close';
			alert($scope.mMayu);
			$scope.mrenderF = function(){
				// alert($scope.mrender);
				if($scope.mrender){
					$scope.mrender = false;
					$scope.mrenderT = 'Mostrar render';
					$scope.mrenderC = 'glyphicon glyphicon-eye-open';
				}
				else{
					$scope.mrender = true;
					$scope.mrenderT = 'Ocultar render';
					$scope.mrenderC = 'glyphicon glyphicon-eye-close';
				} 
			}

			$scope.mcodigoF = function(){
				if($scope.mcodigo){
					$scope.mcodigo = false;
					$scope.mcodigoT = 'Mostrar codigo';
					$scope.mcodigoC = 'glyphicon glyphicon-eye-open';
				}
				else{
					$scope.mcodigo = true;
					$scope.mcodigoT = 'Ocultar codigo';
					$scope.mcodigoC = 'glyphicon glyphicon-eye-close';
				} 
			}	
		}
	}
});


/*angular.module('app').directive('d3Dir', function(){
	return {
		restrict : 'E',
		transclude : false,
		scope : {
			data: '='
		},
		link: function ($scope, element) {
	        var margin = {top: 20, right: 20, bottom: 30, left: 40},
	          width = 480 - margin.left - margin.right,
	          height = 360 - margin.top - margin.bottom;
	        var svg = d3.select(element[0])
	          .append("svg")
	          .attr('width', width + margin.left + margin.right)
	          .attr('height', height + margin.top + margin.bottom)
	          .append("g")
	            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	 
	        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	        var y = d3.scale.linear().range([height, 0]);
	 
	        var xAxis = d3.svg.axis()
	            .scale(x)
	            .orient("bottom");
	 
	        var yAxis = d3.svg.axis()
	            .scale(y)
	            .orient("left")
	            .ticks(10);
	 
	        //Render graph based on 'data'
	        $scope.render = function(data) {
	          //Set our scale's domains
	          x.domain(data.map(function(d) { return d.name; }));
	          y.domain([0, d3.max(data, function(d) { return d.count; })]);
	          
	          //Redraw the axes
	          svg.selectAll('g.axis').remove();
	          //X axis
	          svg.append("g")
	              .attr("class", "x axis")
	              .attr("transform", "translate(0," + height + ")")
	              .call(xAxis);
	              
	          //Y axis
	          svg.append("g")
	              .attr("class", "y axis")
	              .call(yAxis)
	            .append("text")
	              .attr("transform", "rotate(-90)")
	              .attr("y", 6)
	              .attr("dy", ".71em")
	              .style("text-anchor", "end")
	              .text("Count");
	              
	          var bars = svg.selectAll(".bar").data(data);
	          bars.enter()
	            .append("rect")
	            .attr("class", "bar")
	            .attr("x", function(d) { return x(d.name); })
	            .attr("width", x.rangeBand());
	 
	          //Animate bars
	          bars
	              .transition()
	              .duration(1000)
	              .attr('height', function(d) { return height - y(d.count); })
	              .attr("y", function(d) { return y(d.count); })
	        };
	 
	         //Watch 'data' and run $scope.render(newVal) whenever it changes
	         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
	          $scope.$watch('data', function(){
	              $scope.render($scope.data);
	          }, true);  
        }
	}
});*/
angular.module('app').directive('d3Dir', function(){
	return {
		restrict : 'E',
		transclude : false,
		scope : {
			data: '='
		},
		link: function (scope, element) {
			console.log('scope');
			console.log(scope);
	        var margin = {top: 30, right: 20, bottom: 30, left: 20},
		    	width = 960 - margin.left - margin.right,
		    	barHeight = 20,
		    	barWidth = width * .8;

			var i = 0,
			    duration = 400,
			    root;

			var tree = d3.layout.tree()
			    .nodeSize([0, 20]);

			var diagonal = d3.svg.diagonal()
			    .projection(function(d) { return [d.y, d.x]; });

			var svg = d3.select(element[0]).append("svg")
			    .attr("width", width + margin.left + margin.right)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			update(root = scope);
	 
	        //Render graph based on 'data'
	        function update(source) {
	        		console.log('source');
	        		console.log(source);
				  // Compute the flattened node list. TODO use d3.layout.hierarchy.
				  var nodes = tree.nodes(root);

				  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

				  d3.select("svg").transition()
				      .duration(duration)
				      .attr("height", height);

				  d3.select(self.frameElement).transition()
				      .duration(duration)
				      .style("height", height + "px");

				  // Compute the "layout".
				  nodes.forEach(function(n, i) {
				    n.x = i * barHeight;
				  });

				  // Update the nodes…
				  var node = svg.selectAll("g.node")
				      .data(nodes, function(d) { return d.id || (d.id = ++i); });

				  var nodeEnter = node.enter().append("g")
				      .attr("class", "node")
				      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
				      .style("opacity", 1e-6);

				  // Enter any new nodes at the parent's previous position.
				  nodeEnter.append("rect")
				      .attr("y", -barHeight / 2)
				      .attr("height", barHeight)
				      .attr("width", barWidth)
				      .style("fill", color)
				      .on("click", click);

				  nodeEnter.append("text")
				      .attr("dy", 3.5)
				      .attr("dx", 5.5)
				      .text(function(d) { return d.name; });

				  // Transition nodes to their new position.
				  nodeEnter.transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				      .style("opacity", 1);

				  node.transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				      .style("opacity", 1)
				    .select("rect")
				      .style("fill", color);

				  // Transition exiting nodes to the parent's new position.
				  node.exit().transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
				      .style("opacity", 1e-6)
				      .remove();

				  // Update the links…
				  var link = svg.selectAll("path.link")
				      .data(tree.links(nodes), function(d) { return d.target.id; });

				  // Enter any new links at the parent's previous position.
				  link.enter().insert("path", "g")
				      .attr("class", "link")
				      .attr("d", function(d) {
				        var o = {x: source.x0, y: source.y0};
				        return diagonal({source: o, target: o});
				      })
				    .transition()
				      .duration(duration)
				      .attr("d", diagonal);

				  // Transition links to their new position.
				  link.transition()
				      .duration(duration)
				      .attr("d", diagonal);

				  // Transition exiting nodes to the parent's new position.
				  link.exit().transition()
				      .duration(duration)
				      .attr("d", function(d) {
				        var o = {x: source.x, y: source.y};
				        return diagonal({source: o, target: o});
				      })
				      .remove();

				  // Stash the old positions for transition.
				  nodes.forEach(function(d) {
				    d.x0 = d.x;
				    d.y0 = d.y;
				  });
				}

			function click(d) {
		  		if (d.children) {
			    	d._children = d.children;
			   		d.children = null;
			  	} else {
			    	d.children = d._children;
			    	d._children = null;
			  	}
			  	$scope.update(d);
			}

			function color(d) {
			  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
			}
		 
		         //Watch 'data' and run $scope.render(newVal) whenever it changes
		         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
		          /*$scope.$watch('data', function(){
		              $scope.render($scope.data);
		          }, true);*/ 
		} 
	}
});

angular.module('app').directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);
