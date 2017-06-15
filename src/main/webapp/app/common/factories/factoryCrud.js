angular.module('app').factory('factoryCRUD', function(){
	return function(api, overlay){
		var obj = {
			uri:api.uri,
			options:{},
			_argumentos: function (a1, a2, a3, a4) {
				var options={},data,okfunc,errorfunc;
				var isFunction = angular.isFunction;
				switch (arguments.length){
					case 4:
                		errorfunc = a4;
                		okfunc = a3;
              			//fallthrough
             		case 3:
             		case 2:
               			if (isFunction(a2)) {
                  			if (isFunction(a1)) {
                    			okfunc = a1;
                    			errorfunc = a2;
                    			break;
                  			}

                  			okfunc = a2;
                  			errorfunc = a3;
                  			//fallthrough
                		} else {
	                  		options = a1;
	                  		data = a2;
	                  		okfunc = a3;
	                  		break;
                		}
              		case 1:
		                if (isFunction(a1)) okfunc = a1;
		                else options = a1;
		                break;
		            case 0: break;
		            default:
		                throw $resourceMinErr('badargs',
		                  "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
		                  arguments.length);
				};
				return {options: options,data:data,okfunc:okfunc, errorfunc:errorfunc};
			},
			_errorfunc: function(func) {
				return function(data){
					overlay.muestraAlert("0","Error: " + data.data + "\nStatus: "+data.statusText,2000);
					if (func !== undefined) 
						func(data);
				}
			},
			_prefilterOptions: function(options){
				//devuelve un clon de options que gestiona el concepto de prefiltro sin modificar el servicio rest
				//clono el objeto dataOptions para quitarle el prefiltro
				var opts = options.constructor();
				for (var key in options) {
				    opts[key] = options[key];
				}				

				//caso especial con existencia de prefilter
				if (opts.prefilter!=undefined&&opts.prefilter!=''){
					if ((opts.filter!=undefined)&&(opts.filter!='')) opts.filter=opts.prefilter+" AND "+opts.filter;
					else opts.filter=opts.prefilter;
					//elimino prefilter de opts?
					delete opts.prefilter;
				}

				return opts;
			},
			getById: function(a1,a2,a3) {
				var args = this._argumentos(a1,a2,a3);
				api.get(args.options, args.okfunc, this._errorfunc(args.errorfunc));
			},
			getAll: function(a1,a2,a3) {
				var args = this._argumentos(a1,a2,a3);
				api.getAll(this._prefilterOptions(args.options), args.okfunc, this._errorfunc(args.errorfunc));
			},
			getCount: function(a1,a2,a3) {
				var args = this._argumentos(a1,a2,a3);
				api.getCount(this._prefilterOptions(args.options), args.okfunc, this._errorfunc(args.errorfunc))
			},
			remove: function(a1,a2,a3) {
				var args = this._argumentos(a1,a2,a3);

				api.remove(args.options, function(data){
					overlay.successMessage("Correcto");
					if (args.okfunc !== undefined) 
						args.okfunc(data);
				}, this._errorfunc(args.errorfunc));
			},
			insert: function(a1,a2,a3) {
				var args = this._argumentos(a1,a2,a3);

				api.insert(args.options, function(data){
					overlay.successMessage("Correcto");
					if (args.okfunc !== undefined) 
						args.okfunc(data);
				}, this._errorfunc(args.errorfunc));
			},
			update: function(a1,a2,a3,a4) {
				var args = this._argumentos(a1,a2,a3,a4);

				api.update(args.options, args.data, function(data){
					overlay.successMessage("Correcto");
					if (args.okfunc !== undefined) 
						args.okfunc(data);
				}, this._errorfunc(args.errorfunc));
			}
		};
	
		return obj;
	}
});


angular.module('app').factory('factoryPagCrud', function($rootScope) {
	return function(id, apiCrud, apiPage){
		var obj = {
			id : id,
			api : apiCrud,
			// datos : [],
			dataOptions : {},
			objPag: {},
			apiPage : apiPage,
			setPage: function(){
				this.getPage(this.apiPage.getOffset());
			},
			// setFirstPage: function(){

			// },
			// setPreviousPage: function(){

			// },
			// setNextPagePage: function(){

			// },
			// setLastPage: function (){

			// },
			getData:function(id){
				return this.api.getById(id, function(data){
					$rootScope.$broadcast('dataLoaded', {data: data, id:obj.id});
					/*this.datos = data;
					console.log(this.datos);*/
					// datos = data;
				}, function(data){
					console.log("Error getData");
				});
			},
			getPage: function(offset){
			    if(offset){
					this.dataOptions.offset = offset;
				} else {
					this.dataOptions.offset = 0;
					this._genPag();
				}
				// console.log(this.dataOptions)
				return this.api.getAll(this.dataOptions, function(data){
					// obj.datos = data;
					$rootScope.$broadcast('pageLoaded', {data: data, id:obj.id});
					//console.log('OBJ.DATOS')
					//console.log(obj.datos);
				}, function(data){
					console.log("Error getPage");
				});
			},
			setOptions: function(options){
				this.dataOptions = options;
				// this.options = options;
				// console.log(this.options);
			},
			setLimit: function(num){
				this.dataOptions.limit = parseInt(num);
				this.getPage();
			},
			setFilter: function(param) {
				this.dataOptions.filter = param;
				this.getPage();
			},
			setSort: function(param, order) {
				if(order === undefined) {
					order = (this.dataOptions.order == 'ASC') ? 'DESC' : 'ASC';
				}
					
				this.dataOptions.orderby = param;
				this.dataOptions.order = order;
				this.getPage();
				 
			},
			exportExcel: function(){
				//busco el ultimo / y le quito lo de la derecha
				//TODO esto solo funcionara con generic REST
				var opt=this.dataOptions;
				var uri=this.api.uri;
				var i1=uri.lastIndexOf('/');
				if (i1>0) uri = uri.substr(0,i1);
				console.log(uri);
				console.log(this.dataOptions);
				uri+='?offset='+opt.offset;
				uri+='&limit='+opt.limit;
				uri+='&order='+opt.order;
				uri+='&orderby='+opt.orderby;
				uri+='&fields='+opt.fields;
				uri+='&filter='+opt.filter;
				uri+='&format=XLS';
				console.log(uri);
				window.open(uri,'_new');
			},
			/*clear: function() {
				// this.api = apiCrud;
				// this.data.length = 0;
				console.log(this.options);
				this.dataOptions = this.options;
				console.log(this.dataOptions);
				// this.objPag= {};
				// this.apiPage = apiPage;
				this.getPage();
			},*/
			_genPag: function(){
				var options = this.dataOptions;
				this.api.getCount(options, function (data){
					this.objPag = apiPage.generatePagination(data.count, options.limit, 10);
					// $rootScope.$broadcast('pageLoaded'); 
				}, function(data){
					console.log("Error _genPag")
				});
			}
		};	
		return obj;
	}
});


angular.module('app').factory('eduOverlayFactory',function(){
	var obj = {
			initOverlayObject: function(scope, timeout){
				var overlay = {
					show:false,
					showOverlayLoading:false,
					result:'',
					type:'',
					message:'',
					dutation:0,
					showOverlay: function(){
						this.showOverlayLoading = true;
					},
					hideOverlay: function(){
						this.showOverlayLoading = false;
					},
					muestraAlert: function (type, text, duration, okfunc) {
						this.show = true;
						this.showOverlayLoading = false;
						this.okfunc = okfunc;
						this.type = (type == '1') ? 'success' : (type=='0')? 'danger' : 'info';
						this.message = text;
						var closeForm = function () {
							this.show = false;
							scope.$apply();
						};
						timeout(closeForm, duration);
					},
					errorManager: function(data){
						overlay.muestraAlert("0","Error:"+data.data,2000);
					},
					okCancelMessage: function(message,okfunc){
						this.muestraAlert("2",message,0,okfunc);
					},
					successMessage: function(message){
						this.muestraAlert("1",message,2000);
					},
					errorMessage: function(message){
						this.muestraAlert("0",message,2000);
					}
				};
				return overlay;
			}
	};
	
	return obj;
});


/*angular.module('app').factory('managerFactoryCrud',function(){
	var obj = {
			getDeleteManager: function(api,data,ouid,overlay,okfunc){
				console.log("DELETE:"+ouid);
				api.remove(ouid, data, function(data){
					overlay.successMessage("Correcto");
					if (okfunc !== undefined) okfunc();
				}, overlay.errorManager);
			}
	};
	
	return obj;
});*/


angular.module('app').factory('paginationFactory',function(){
	return function(){
		var obj = {
					total:0,
					itemsPerPage:10,
					current:1,
					paginationRange:10,
					totalPages:1,
					pages:[],
					getCurrent: function() {
						return this.current;
					},
					getOffset: function() {
						return ((this.current-1) * this.itemsPerPage);
					},
					getTotal: function() {
						return this.total;
					},
					getLimit: function() {
						return this.itemsPerPage;
					},
					getLastReg: function() {
						return (!this.isOnLastPage()) ? ( (!this.isEmpty()) ? (this.getOffset()+this.getLimit()) : 0 ) : this.getOffset()+this.getLimit()-((this.getOffset()+this.getLimit())-this.getTotal())
					},
					setCurrent: function(current){
						this.current=current;
						this._generatePagesArray();
					},
					setLimit: function(limit) {
						this.itemsPerPage(limit);
					},
					generatePagination:function (total, itemsPerPage, paginationRange){
						this.total = total;
						this.itemsPerPage = itemsPerPage;
						this.current = 1;
						this.paginationRange = paginationRange;
						this._generatePagesArray();
					},
					isEmpty: function() {
						return (this.getTotal() == 0);
					},
					isOnFirstPage: function (){
						return (this.getCurrent() ==  1);
					},					
					isOnLastPage: function(){
						var pages = this.pages;
						if (pages.length>0) 
							return this.getCurrent() == pages[pages.length-1];
						else 
							return false;
					},
					setFirstPage: function(){
						this.setCurrent(1);
					},					
					setLastPage: function(){
						var pages = this.pages;
						if (pages.length>0) this.setCurrent(pages[pages.length-1]);
					},
					setNextPage: function(){
						this.setCurrent(this.current+1);
					},					
					setPreviousPage: function(){
						this.setCurrent(this.current-1);
					},
					_generatePagesArray: function () {
						this.pages = [];
						this.totalPages = Math.ceil(this.total / this.itemsPerPage);
						var halfWay = Math.ceil(this.paginationRange / 2);
						var position;

						if (this.current <= halfWay) {
							position = 'start';
						} else if (this.totalPages - halfWay < this.current) {
							position = 'end';
						} else {
							position = 'middle';
						}

						var ellipsesNeeded = this.paginationRange < this.totalPages;
						var i = 1;
						while (i <= this.totalPages && i <= this.paginationRange) {
							var pageNumber = this._calculatePageNumber(i);
							var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
							var closingEllipsesNeeded = (i === this.paginationRange - 1 && (position === 'middle' || position === 'start'));
							
							var page = {};

							
							if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
								page = "...";
							} else {
								page = pageNumber;
							}
							this.pages.push(page);
							i++;
						}
					},
					_calculatePageNumber: function (i) {
						var halfWay = Math.ceil(this.paginationRange / 2);
						if (i === this.paginationRange) {
							return this.totalPages;
						} else if (i === 1) {
							return i;
						} else if (this.paginationRange < this.totalPages) {
							if (this.totalPages - halfWay < this.current) {
								return this.totalPages - this.paginationRange + i;
							} else if (halfWay < this.current) {
								return this.current - halfWay + i;
							} else {
								return i;
							}
						} else {
							return i;
						}
					}
				};
		return obj;
	}
});