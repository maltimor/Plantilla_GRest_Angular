angular.module('app.logout', []);
angular.module('app').requires.push('app.logout');
angular.module('app.logout')
.config(function config($routeProvider) {
	$routeProvider.when('/logout', {
		controller: 'LogoutCtrl',
		templateUrl: 'app/partials/logout/logout.html'
	});
})
.controller('LogoutCtrl', function($rootScope,$scope,$http,$location,
		eduOverlayFactory,dataFactoryApp,paginationFactory,factoryCRUD,factoryPagCrud) {
	var apiApp = dataFactoryApp(appConfig.urlBase+'/logout/:id', '');
	$rootScope.overlay.showOverlay();
	apiApp.getAll({},function(){
		$rootScope.overlay.hideOverlay();
		var protocol = $location.protocol();
		var host = $location.host();
		var port = $location.port();
		var service = protocol+'://'+host+((port!='80'&&port!='443')?':'+port:'')+'/'+appConfig.urlName;
		window.location.href="https://cas.murciaeduca.es/cas/logout?service="+service;
	},$rootScope.overlay.errorManager);
});

