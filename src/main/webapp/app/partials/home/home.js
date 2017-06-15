angular.module('app.home', ['angularFileUpload']);
angular.module('app').requires.push('app.home');
angular.module('app.home')
.config(function config($routeProvider) {
	$routeProvider.when('/home', {
		controller: 'HomeCtrl',
		templateUrl: 'app/partials/home/home.html'
	});
})
.filter('userResumen',function(){
	return function(user){
		if ((user!=undefined)&&(user.attr!=undefined)){
			var res = user.attr.NOMBRE+' '+user.attr.APELLIDO1+' '+user.attr.APELLIDO2+' ('+user.login+')';
			return res;
		} else return '';
	}
})
.controller('HomeCtrl', function($rootScope,$scope,$http,$location,
		eduOverlayFactory,dataFactoryApp,paginationFactory,factoryCRUD,factoryPagCrud) {
	
	var apiApp = dataFactoryApp(appConfig.urlBase+'/setPreferences/:id', '');
	
	$scope.perfilSel=null;
	
	$scope.seleccionarPerfil=function(){
		console.log("seleccionarPerfil");
		$rootScope.overlay.showOverlay();
		
		var data = {
			PERFIL:$scope.perfilSel
		};
		apiApp.insert(data,function(data){
			$rootScope.overlay.hideOverlay();
			$scope.refreshUser();
			$location.url("/");
		},$rootScope.overlay.errorManager);
	}
	
	$scope.$watch('user.attr.PERFIL',function(){
		if ($rootScope.user && $rootScope.user.attr && $rootScope.user.attr.PERFIL) 
			$scope.perfilSel = $rootScope.user.attr.PERFIL;
	});

});

