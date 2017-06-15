angular.module('app.emps', []);
angular.module('app').requires.push('app.emps');
angular.module('app.emps')
.config(function config($routeProvider) {
	$routeProvider.when('/emps', {
		controller: 'EmpsCtrl',
		templateUrl: 'app/partials/emps/emps.html'
	});
})
.controller('EmpsCtrl', function($rootScope,$scope,$http,$location,$route,
		lupaFactory,eduOverlayFactory,dataFactoryApp,paginationFactory,factoryCRUD,factoryPagCrud) {
	
	//compruebo que tengo el rol requerido para dicha pantalla
	if (!$rootScope.checkAnyPerfil(appConfig.adminProfile)) return;

	var apiEMP = dataFactoryApp(appConfig.urlBase+'/EMP/:id', '');
	
	$scope.apiApp = dataFactoryApp(appConfig.urlBase+'/VIEW_EMP/:id', '');
	$scope.pagination = paginationFactory();
	$scope.apiCrud = factoryCRUD($scope.apiApp, $rootScope.overlay);
	$scope.apiPagCrudFn = factoryPagCrud(1, $scope.apiCrud, $scope.pagination);
	$scope.data=[];
	$scope.dataSel={};
	$scope.ID=undefined;
	$scope.showCategoria=false;
	$scope.insert=false;

	//GESTION DEL LISTADO
	$scope.genOptions = {
			limit:10,
			orderby:'ID',
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
		$scope.dataSel=item;
		$scope.ID=item.ID;
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
			apiEMP.insert($scope.dataSel, function(data){
				$rootScope.overlay.hideOverlay();
				$scope.insert=false;
				$scope.dataSel=data;
				$scope.ID=data.ID;
			}, $rootScope.overlay.errorManager);
		} else {
			apiEMP.update({id:$scope.ID}, $scope.dataSel, function(data){
				$rootScope.overlay.hideOverlay();
				$scope.insert=false;
				$scope.dataSel=data;
				$scope.ID=data.ID;
			}, $rootScope.overlay.errorManager);
		};
	}
	
	
	$scope.eliminar = function (ID) {
		$scope.overlay.okCancelMessage('¿Realmente quiere eliminar este elemento?',function(){
			$rootScope.overlay.showOverlay();
			apiEMP.remove({id:ID}, function(data){
				$rootScope.overlay.hideOverlay();
				mostrarDatos();
			}, $rootScope.overlay.errorManager);
		});
	}
	
	var lupaDeps={
			title:'Pick a Dep',
			url:appConfig.urlBase+'/DEP/:id',
			orderby:'NAME',
			fields:'ID,NAME',
			size:'lg'
		};
	$scope.openLupaDeps=function(){
		lupaFactory().open(lupaDeps,function(data){
			$scope.dataSel.ID_DEP= data.ID;
			$scope.dataSel.DEP_NAME = data.NAME;
		},function(data){
		});
	}
	
	mostrarDatos();
});

