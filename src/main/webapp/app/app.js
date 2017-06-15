


var app = angular.module('app', [ 'ngResource', 'ngSanitize', 'ui.bootstrap','ngRoute' ]);
app.config(function config($routeProvider,$httpProvider) {
	$routeProvider.otherwise({
		redirectTo: appConfig.home
	});
});
app.controller('MainCtrl', function($scope,$rootScope,$timeout,$location,$http,$window,$filter,
		eduOverlayFactory,dataFactoryApp) {
	$rootScope.appConfig=appConfig;
	$rootScope.user=appConfig.user;
	$rootScope.entorno='???';
	$rootScope.overlay=eduOverlayFactory.initOverlayObject($scope, $timeout);
	//estas variables gestion el F5, primero cargo los datos del usuario y desactiva el location change
	var cargandoDatos=true;
	var verPerfil=undefined;
	
	function clonaItem(item){
		var obj={
			id:item.id,
			nombre:item.nombre,
			proceso:item.proceso,
			url:item.url,
			submenu:[]
		};
		return obj;
	}
	
	//true si el usuario posee el rol 
	function userHasRol(rol){
		if ($rootScope.user==undefined) return false;
		if ($rootScope.user.hasRol==undefined) return false;
		return $rootScope.user.hasRol[rol];
	}
	//true si el usuario posee alguno de los roles (separados por ,)
	function userHasAnyRol(lrol){
		var arr=lrol.split(',');
		for(var i=0;i<arr.length;i++){
			if (userHasRol(arr[i])) return true;
		}
		return false;
	}
	//true si el usuario posee todos los roles (separados por ,)
	function userHasAllRol(lrol){
		var arr=lrol.split(',');
		for(var i=0;i<arr.length;i++){
			if (!userHasRol(arr[i])) return false;
		}
		return true;
	}
	//true si el usuario posee el proceso 
	function userHasProceso(proc){
		if ($rootScope.user==undefined) return false;
		if ($rootScope.user.hasProceso==undefined) return false;
		return $rootScope.user.hasProceso[proc];
	}
	//true si el usuario posee alguno de los procesos (separados por ,)
	function userHasAnyProceso(lproc){
		var arr=lproc.split(',');
		for(var i=0;i<arr.length;i++){
			if (userHasProceso(arr[i])) return true;
		}
		return false;
	}
	//devulve el perfil del usuario 
	function userPerfil(){
		if ($rootScope.user==undefined) return undefined;
		if ($rootScope.user.attr==undefined) return undefined;
		return $rootScope.user.attr.PERFIL;
	}
	//true si el usuario ha seleccionado alguno de los perfiles (separados por ,)
	function userHasAnyPerfil(lperfil){
		var arr=lperfil.split(',');
		for(var i=0;i<arr.length;i++){
			if (userPerfil()==arr[i]) return true;
		}
		return false;
	}
	
	
	//true si el usuario posee todos los procesos (separados por ,)
	function userHasAllProceso(lproc){
		var arr=lproc.split(',');
		for(var i=0;i<arr.length;i++){
			if (!userHasProceso(arr[i])) return false;
		}
		return true;
	}
	
	//obtener la informacion de usuario
	function cargaDatosUsuario(){
		$rootScope.overlay.showOverlay();
		var apiUser=dataFactoryApp(appConfig.urlBase+"/_inituser",'');
		apiUser.get({},function(data,headers){
			$rootScope.overlay.hideOverlay();
			//caso especial de logout si el contentype no es json error y ve a la pagina de login
			if (headers('content-type')!='application/json'){
				window.location.reload();
				return;
			}
			$rootScope.user=data;
			console.log("DATA:");
			console.log(data);
			
			//creo un array para optimizar la busqueda de roles
			$rootScope.user.hasRol={};
			for(var i=0;i<data.roles.length;i++){
				$rootScope.user.hasRol[data.roles[i]]=true;
			}
			//creo un array para optimizar la busqueda de operaciones
			$rootScope.user.hasProceso={};
			if (data.attr.PROCESOS!=undefined && data.attr.PROCESOS!=undefined){
				for(var i=0;i<data.attr.PROCESOS.length;i++){
					$rootScope.user.hasProceso[data.attr.PROCESOS[i]]=true;
				}
			}
			
			//en attr tengo el entonro
			$rootScope.entorno=data.attr.ENTORNO;

			//mecanismo asincrono de gestion del perfil, hasta que no se carguen los datos no puedo saber si tengo que redirigir al home
			//TODO que pasa si falla esta llamada?
			cargandoDatos=false;
			
			$scope.$emit('datosCargados');
			
			if (verPerfil!=undefined) compruebaPerfil(verPerfil); 
			
		},$rootScope.overlay.errorManager);
	}
	
	//funcion que obtiene la version y el numero de servidor
	function cargaInfo(){
		$rootScope.overlay.showOverlay();
		var apiUser=dataFactoryApp(appConfig.urlBase+"/getInfo",'');
		apiUser.get({},function(data){
			$rootScope.overlay.hideOverlay();
			$rootScope.info=data;
			console.log(data);
		},$rootScope.overlay.errorManager);
	}
	
	$scope.changeState=function(itemmenu){
  	  angular.forEach($scope.menu, function(item){
  		  if(item.nombre===itemmenu.nombre){
  			  item.state="btn-primary";
  		  }else{
  			  item.state="";
  		  }
  	  });
	}
	var setInactive=function(menu){
		for(var i=0;i<menu.length;i++){
			menu[i].state="inactive";
			if(menu[i].submenu.length>0){
				setInactive(menu[i].submenu);
			}
		}    
	}
	
	$scope.onClickNavigation=function(menu,item){
		//if(item.breadcrumbs.length>0) $rootScope.breadcrumbs=item.breadcrumbs;
    	setInactive(menu);
    	item.state='active';
		$location.path( item.url );
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}

	function compruebaPerfil(next){
		console.log('comprueba perfil:'+next);
		verPerfil=undefined;
		
		if (endsWith(next,appConfig.urlName+'/')||endsWith(next,appConfig.urlName+'/#'+appConfig.home)||endsWith(next,appConfig.urlName+'/#/logout')) return true;
		
		/*console.log("CAMBIO?");
		//comprueba que he seleccionado un perfil
		if($rootScope.user.attr.PERFIL==undefined || $rootScope.user.attr.PERFIL==null){
			console.log("EVITO CAMBIO DE PANTALLA");
			console.log($rootScope.user);
			$location.url(appConfig.home);
			return false;
		}*/
		return true;
	}
	
	
	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		console.log('locationChange start:'+current+' -> '+next);
		
		//si no he seleccionado perfil no puedo entrar
		//solo las rutas / , #/home  y #/logout  no estan restringidas
		
		//si ademas, estoy cargando los datos del usuario encolo la peticion de cambio, cuando termine de cargarlos
		if (cargandoDatos==true) {
			addOp('location',next);
			verPerfil=next;
			return;
		}
		
		compruebaPerfil(next);
    });

	$scope.goTo=function(to){
		$location.url(to);
	}
	$scope.refreshUser=function(){
		cargaDatosUsuario();
	}
	
	//hago publicas las funciones de acceso a los roles
	$rootScope.userHasRol=userHasRol;
	$rootScope.userHasAnyRol=userHasAnyRol;
	$rootScope.userHasAllRol=userHasAllRol;
	//hago publicas las funciones de acceso a los procesos
	$rootScope.userHasProceso=userHasProceso;
	$rootScope.userHasAnyProceso=userHasAnyProceso;
	$rootScope.userHasAllProceso=userHasAllProceso;
	//hago publico las funciones que tratan el perfil del usuario
	$rootScope.userPerfil=userPerfil;
	$rootScope.userHasAnyPerfil=userHasAnyPerfil;
	
	//compruebo que tengo el rol requerido para dicha pantalla
	$rootScope.checkAnyRol=function(lrol){
		//si aun estoy cargando datos meto la peticion en la cola y salgo con ok
		if (cargandoDatos){
			addOp('checkAnyRol',lrol);
			return true;
		} else return checkAnyRolImpl(lrol);
	}
	
	//compruebo que tengo el perfil requerido para dicha pantalla
	$rootScope.checkAnyPerfil=function(lrol){
		//si aun estoy cargando datos meto la peticion en la cola y salgo con ok
		if (cargandoDatos){
			addOp('checkAnyPerfil',lrol);
			return true;
		} else return checkAnyPerfilImpl(lrol);
	}

	
	//gestion de la cola de peticiones
	var ops=[];
	function addOp(tipo,param){
		ops.push({tipo:tipo,param:param});
	}
	
	function checkPermissionFailed(){
		//doy un mensaje de error
		$rootScope.overlay.errorMessage('No tiene permisos para acceder aqui:'+$location.url());
		$location.url(appConfig.home);
		return false;
	}
	
	function checkAnyRolImpl(lrol){
		if (!userHasAnyRol(lrol)) return checkPermissionFailed();
		return true;
	}

	function checkAnyPerfilImpl(lperfil){
		if (!userHasAnyPerfil(lperfil)) return checkPermissionFailed();
		return true;
	}

	//gestion asincrona de la carga de datos
	$scope.$on('datosCargados',function(){
		//aqui proceso todas las peticiones acumuladas hasta aqui, si alguna peticion no es valida muestro el mensaje y cambio el location
		for(var i=0;i<ops.length;i++){
			var op=ops[i];
			if (op.tipo=='checkAnyRol') {
				if (!checkAnyRolImpl(op.param)) break;
			} else if (op.tipo=='checkAnyPerfil') {
				if (!checkAnyPerfilImpl(op.param)) break; 
			} else if (op.tipo=='location') {
				if (!compruebaPerfil(op.param)) break;
			}
		}
		//vacio la pila
		ops=[];
	});
	
	//invocamos la carga de datos
	cargaDatosUsuario();
	cargaInfo();

});




//
//window.onbeforeunload=function (event) {
//    // do whatever you want in here before the page unloads.        
//	console.log("HHDFFDHFDSHGFHGFHGFHD");
//	
//    // the following line of code will prevent reload or navigating away.
//    event.preventDefault();
//    
//    return null;
//    
//    //return "JODER";
//};
