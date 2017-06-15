

angular.module('app').factory('validationFactory', function() {
	var obj = {
		isNumeric: function( obj ) {
			return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
		},
		isRange: function (obj,min,max){
			//presume que obj es numero
			return this.isNumeric(obj)&&(obj>=min)&&(obj<=max);
		},
		isNumericList: function(obj, sep){
			if (obj=="") return true;
			if (obj===undefined) return true;
			
			var a = obj.split(sep);
			for(var i=0;i<a.length;i++){
				if (!this.isNumeric(a[i])) return false;
			}
			return true;
		}
	};
	return obj;
});

