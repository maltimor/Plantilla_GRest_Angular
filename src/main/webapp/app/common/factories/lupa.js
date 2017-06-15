angular.module('app').factory('lupaFactory',function($rootScope,$modal,
		eduOverlayFactory,dataFactoryApp,paginationFactory,factoryCRUD,factoryPagCrud){
	return function(){
		var obj = {
			total:0,
			open: function (opciones,result,cancel) {
				//size(str),title(str),id(int),fields(str),order(str),orderby(str)
				//limpio los parametros
				opciones.size=opciones.size||'';
				opciones.id=opciones.id||(Math.floor((Math.random() * 9999) + 1));
				opciones.fields=opciones.fields||'';
				opciones.title=opciones.title||'';

				opciones.filter=opciones.filter||'';
				opciones.prefilter=opciones.prefilter||'';
				opciones.orderby=opciones.orderby||'ID';
				opciones.order=opciones.order||'ASC';
				opciones.limit=opciones.limit||10;
				opciones.offset=opciones.offset||0;
				
				var template = 'app/partials/directivas/lupa.tpl.html';
				if (opciones.template!=undefined) template = opciones.template; 
								
				//transformo los fields en un array mas facil de procesar
				var keys = opciones.fields.split(',');
				
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: template,
					controller: function ($scope, $modalInstance) {

						$scope.keys=keys;
						$scope.title=opciones.title;
						$scope.ok = function (item) {
							$modalInstance.close(item);
						};
						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						
						$scope.apiApp = dataFactoryApp(opciones.url, '');
						$scope.pagination = paginationFactory();
						$scope.apiCrud = factoryCRUD($scope.apiApp, $rootScope.overlay);
						$scope.apiPagCrudFn = factoryPagCrud(opciones.id, $scope.apiCrud, $scope.pagination);
						$scope.data=[];
						$scope.opciones=opciones;
						$scope.genOptions = {
								limit:opciones.limit,
								orderby:opciones.orderby,
								order:opciones.order,
								offset: opciones.offset,
								filter:opciones.filter,
								prefilter:opciones.prefilter,
								fields:'*'
							};
						
						function mostrarDatos() {
							$rootScope.overlay.showOverlay();
							$scope.apiPagCrudFn.setOptions($scope.genOptions);
							$scope.apiPagCrudFn.getPage();
						}
						$scope.$on('pageLoaded', function(event, data) {
							$rootScope.overlay.hideOverlay();
							if (data.id==opciones.id) $scope.data = data.data;
						});
						$scope.sortSrc = function(param){
							$scope.apiPagCrudFn.setSort(param);
						}
						$scope.setPageSrc = function() {
							$rootScope.overlay.showOverlay();
							$scope.apiPagCrudFn.setPage();
						}
						
						//solo llamo a mostrar datos si hay url 
						if (opciones.url!=undefined) mostrarDatos();
			    	},
			    	size: opciones.size,
			    	resolve: {
			    		items: function () {
			    			return obj.items;
			    		}
			    	}
			    });
			    modalInstance.result.then(function (data) {
			    	console.log(data);
			    	if (result) result(data);
			    }, function (data) {
			    	console.log("ERROR");
			    	console.log(data);
			    	if (cancel) cancel(data);
			    });
			}
		};
		return obj;
	}
});




