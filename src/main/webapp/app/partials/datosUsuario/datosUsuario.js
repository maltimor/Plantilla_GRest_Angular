angular.module('app.datosUsuario', []);
angular.module('app').requires.push('app.datosUsuario');
angular.module('app.datosUsuario')
.config(function config($routeProvider) {
	$routeProvider.when('/datosUsuario', {
		controller: 'DatosUsuarioCtrl',
		templateUrl: 'app/partials/datosUsuario/datosUsuario.html'
	});
})
.controller('DatosUsuarioCtrl', function($rootScope,$scope,$http,$location,
		eduOverlayFactory,dataFactoryApp,paginationFactory,factoryCRUD,factoryPagCrud) {

	//compruebo que tengo el rol requerido para dicha pantalla
	//if(!$rootScope.checkAnyRol('ADMIN')) return;
	
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

	$scope.$watch('user',function(){
		console.log("USER:"+$rootScope.user);
		$rootScope.overlay.showOverlay();
		$scope.u=syntaxHighlight(JSON.stringify($rootScope.user||{}, undefined, 4));	
		$rootScope.overlay.hideOverlay();
	});
	
});

