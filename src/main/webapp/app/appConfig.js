
var appConfig={
	nombre: 'Plantilla',
	version: '1.0',
	copyright: 'todos los derechos reservados',
	showView: 'authorized',
	user: { login:'', roles:[]},
	home: '/home',
	urlName: 'plantilla',
	urlBase: 'services/genericRestService',
	adminProfile: 'ADMIN',
	menu:[
	  	{
	  		"id":"1",
	  		"nombre":"Menu Admin",
	  		"proceso":"ADMIN",
	  		"submenu":[
	  		           {
	  			  		"id":"1",
	  			  		"nombre":"DEP",
	  			  		"proceso":"ADMIN",
	  			  		"url":"deps",
	  			  		"submenu":[]
	  		           },
	  		           {
		  			  		"id":"2",
		  			  		"nombre":"EMP",
		  			  		"proceso":"ADMIN",
		  			  		"url":"emps",
		  			  		"submenu":[]
		  		           }
	  		           ]
	  	},
	  	{
	  		"id":"1",
	  		"nombre":"Menu User",
	  		"proceso":"USER",
	  		"submenu":[
	  		           {
		  			  		"id":"1",
		  			  		"nombre":"Menu2",
		  			  		"proceso":"USER",
		  			  		"url":"",
		  			  		"submenu":[]
		  		           }
	  		           ]
	  	},
	  	{
	  		"id":"1",
	  		"nombre":"Administracion Global",
	  		"proceso":"ADMIN",
	  		"submenu":[
	  			  	{
	  			  		"id":"14",
	  			  		"nombre":"Servicios",
	  			  		"proceso":"ADMIN",
	  			  		"url":"servicios",
	  			  		"submenu":[]
	  			  	}
  			  	]
	  	},
 	  	{
		  		"id":"1",
		  		"nombre":"Datos del Usuario",
		  		"proceso":"ADMIN,USER",
		  		"url":"datosUsuario",
		  		"submenu":[]
		 }
	  	]
};

