

angular.module('app')

.constant('intInputConfig', {
  step: 1,
  readonlyInput: false,
  mousewheel: true
})

.controller('IntInputController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'intInputConfig', function($scope, $attrs, $parse, $log, $locale, intInputConfig) {
  var selected = null,
      ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl

  this.init = function( ngModelCtrl_, inputs ) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    var valueInputEl = inputs.eq(0);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : intInputConfig.mousewheel;
    if ( mousewheel ) {
      this.setupMousewheelEvents( valueInputEl );
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : intInputConfig.readonlyInput;
    this.setupInputEvents( valueInputEl );
  };

  var step = intInputConfig.step;
  if ($attrs.step) {
    $scope.$parent.$watch($parse($attrs.step), function(value) {
      step = parseInt(value, 10);
    });
  }

  var min=undefined;
  if ($attrs.min) {
	    $scope.$parent.$watch($parse($attrs.min), function(value) {
	      min = parseInt(value, 10);
	    });
  }
  var max=undefined;
  if ($attrs.max) {
	    $scope.$parent.$watch($parse($attrs.max), function(value) {
	      max = parseInt(value, 10);
	    });
  }
 
  
  function getValueFromTemplate ( ) {
    var value = parseInt( $scope.value, 10 );
    var valid = !isNaN(value);
    if ( !valid ) {
      return undefined;
    }

    return value;
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function( valueInputEl ) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
      return (e.detail || delta > 0);
    };

    valueInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply( (isScrollingUp(e)) ? $scope.increment() : $scope.decrement() );
      e.preventDefault();
    });
  };

  this.setupInputEvents = function( valueInputEl ) {
    if ( $scope.readonlyInput ) {
      $scope.update = angular.noop;
      return;
    }

    var invalidate = function(invalid) {
      ngModelCtrl.$setViewValue( null );
      ngModelCtrl.$setValidity('time', false);
      if (angular.isDefined(invalid)) {
        $scope.invalid = invalid;
      }
    };

    $scope.update = function() {
      var value = getValueFromTemplate();

      if ( angular.isDefined(value) ) {
        selected = value ;
        refresh( );
      } else {
        invalidate(true);
      }
    };
  };

  this.render = function() {
    var value = ngModelCtrl.$modelValue ? ( ngModelCtrl.$modelValue ) : null;

    if ( isNaN(value) ) {
      ngModelCtrl.$setValidity('time', false);
      $log.error('IntInput directive: "ng-model" value must be a valid object');
    } else {
      if ( value ) {
        selected = value;
      }
      makeValid();
      updateTemplate();
    }
  };

  // Call internally when we know that model is valid.
  function refresh( ) {
    makeValid();
    ngModelCtrl.$setViewValue( selected );
    updateTemplate( );
  }

  function makeValid() {
    ngModelCtrl.$setValidity('time', true);
    $scope.invalid = false;
  }

  function updateTemplate( ) {
//    $scope.value = $locale.DATETIME_FORMATS.SHORTMONTH[selected-1];
    $scope.value = selected;
  }

  function add( delta ) {
    selected+=delta;
    if (selected>max) selected = max;
    if (selected<min) selected = min;
    refresh();
  }

  $scope.increment = function() {
    add( step );
  };
  $scope.decrement = function() {
    add( - step );
  };
}])

.directive('intInput', function () {
  return {
    restrict: 'EA',
    require: ['intInput', '?^ngModel'],
    controller:'IntInputController',
    replace: true,
    scope: {},
    templateUrl: 'app/partials/directivas/intInput.tpl.html',
    link: function(scope, element, attrs, ctrls) {
      var intInputCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if ( ngModelCtrl ) {
        intInputCtrl.init( ngModelCtrl, element.find('input') );
      }
    }
  };
});


