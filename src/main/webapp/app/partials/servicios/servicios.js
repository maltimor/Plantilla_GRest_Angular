angular.module('app.servicios', []);
angular.module('app').requires.push('app.servicios');
angular.module('app.servicios')
.config(function config($routeProvider) {
	$routeProvider.when('/servicios', {
		controller: 'ServiciosCtrl',
		templateUrl: 'app/partials/servicios/servicios.html'
	});
})
.controller('ServiciosCtrl', function($rootScope,$scope,$http,$location,$route,
		eduOverlayFactory,dataFactoryApp,paginationFactory,factoryCRUD,factoryPagCrud) {
	
	//compruebo que tengo el rol requerido para dicha pantalla
	if (!$rootScope.checkAnyPerfil(appConfig.adminProfile)) return;

	$scope.apiApp = dataFactoryApp(appConfig.urlBase+'/G_SERVICES/:id', '');
	$scope.pagination = paginationFactory();
	$scope.apiCrud = factoryCRUD($scope.apiApp, $rootScope.overlay);
	$scope.apiPagCrudFn = factoryPagCrud(1, $scope.apiCrud, $scope.pagination);
	$scope.data=[];
	$scope.dataExample=[];
	$scope.dataSel={};
	$scope.info="";
	$scope.ID=undefined;
	$scope.showCategoria=false;
	$scope.insert=false;

	//GESTION DEL LISTADO
	$scope.genOptions = {
			limit:10,
			orderby:'TABLE_NAME',
			order:'ASC',
			offset: 0,
			filter: '',
			fields:'*'
		};
	
	function mostrarDatos() {
		$rootScope.overlay.showOverlay();
		$scope.apiPagCrudFn.setOptions($scope.genOptions);
		$scope.apiPagCrudFn.getPage();
	}
	$scope.$on('pageLoaded', function(event, data) {
		$rootScope.overlay.hideOverlay();
		if (data.id==1) $scope.data = data.data;
	});
	$scope.ver = function(item) {
		console.log(item);
		getApi('/mapperinfotable/:id').get({id:item.TABLE_NAME},function(data){
			$scope.info=syntaxHighlight(JSON.stringify(data||{}, undefined, 4));	
		},$rootScope.overlay.errorManager);
		$scope.dataSel=item;
		$scope.ID=item.TABLE_NAME;
		$scope.showCategoria=true;
		$scope.insert=false;
		//no cambio de hoja
	}
	$scope.volver = function() {
		$scope.dataSel={};
		$scope.ID=undefined;
		$scope.showCategoria=false;
		mostrarDatos();
		//no cambio de hoja
	}
	$scope.sortSrc = function(param){
		$scope.apiPagCrudFn.setSort(param);
	}
	$scope.setPageSrc = function() {
		$rootScope.overlay.showOverlay();
		$scope.apiPagCrudFn.setPage();
	}
	
	$scope.newItem=function(){
		$scope.dataSel={};
		$scope.ID=undefined;
		$scope.showCategoria=true;
		$scope.insert=true;
	}
	
	$scope.grabar = function () {
		$rootScope.overlay.showOverlay();

		if ($scope.insert){
			$scope.apiCrud.insert($scope.dataSel, function(data){
				$rootScope.overlay.hideOverlay();
				$scope.insert=false;
				$scope.dataSel=data;
				$scope.ID=data.TABLE_NAME;
			}, $rootScope.overlay.errorManager);
		} else {
			$scope.apiCrud.update({id:$scope.ID}, $scope.dataSel, function(data){
				$rootScope.overlay.hideOverlay();
				$scope.insert=false;
				$scope.dataSel=data;
				$scope.ID=data.TABLE_NAME;
			}, $rootScope.overlay.errorManager);
		};
	}
	
	
	$scope.eliminar = function (ID) {
		$scope.overlay.okCancelMessage('¿Realmente quiere eliminar este elemento?',function(){
			$rootScope.overlay.showOverlay();
			$scope.apiCrud.remove({id:ID}, function(data){
				$rootScope.overlay.hideOverlay();
				mostrarDatos();
			}, $rootScope.overlay.errorManager);
		});
	}
	
	$scope.reload = function(){
		var api = dataFactoryApp(appConfig.urlBase+'/reload/:id', '');
		$rootScope.overlay.showOverlay();
		api.execute({},{},function(data){
			$rootScope.overlay.hideOverlay();
		},$rootScope.overlay.errorManager);
	}
	
	mostrarDatos();
	
	
	//PREVISUALIZACION DE DATOS
	function getApi(table) { return dataFactoryApp(appConfig.urlBase+table, ''); }
	function syntaxHighlight(json) {
	    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
	        var cls = 'number';
	        if (/^"/.test(match)) {
	            if (/:$/.test(match)) {
	                cls = 'key';
	            } else {
	                cls = 'string';
	            }
	        } else if (/true|false/.test(match)) {
	            cls = 'boolean';
	        } else if (/null/.test(match)) {
	            cls = 'null';
	        }
	        return '<span class="' + cls + '">' + match + '</span>';
	    });
	}
	
	$scope.showDataExample=false;
	$scope.previsualiza=function(){
		var opts={limit:10,offset:0,filter:'',fields:'*'};
		$scope.showDataExample=true;
		$scope.dataExample={};
		getApi('/'+$scope.ID+'/:id').getAll(opts,function(data){
			$scope.dataExample=syntaxHighlight(JSON.stringify(data||{}, undefined, 4));	
		},$rootScope.overlay.errorManager);
	}

	
});

