'use strict';

angular.module('angular-cron-jobs', ['templates-angularcronjobs']);

'use strict';

angular.module('angular-cron-jobs').directive('cronSelection', ['cronService', function(cronService) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            config : '=',
            output : '=?',
            init   : '=?'
        },
        templateUrl: function(element, attributes) {
          return attributes.template || 'cronselection.html';
        },
        link: function($scope) {

            var originalInit = undefined;
            var initChanged = false;

            $scope.frequency = [
                {
                    value : 1,
                    label : 'percben'
                },
                {
                  value : 2,
                  label : 'óra'
                },
                {
                  value : 3,
                  label : 'nap'
                },
                {
                  value : 4,
                  label : 'héten'
                },
                {
                  value : 5,
                  label : 'hónap'
                },
                {
                  value : 6,
                  label : 'év'
                }
            ];

            if (angular.isDefined($scope.init)) {
                //console.log('init value found: ', $scope.init);
                originalInit = angular.copy($scope.init);
                $scope.myFrequency = cronService.fromCron($scope.init);
            }

            $scope.$watch('init', function(newValue){
                //console.log('watch on init fired!', newValue, originalInit);
                if(angular.isDefined(newValue) && newValue && (newValue !== originalInit)){
                    initChanged = true;
                    $scope.myFrequency = cronService.fromCron(newValue);
                }
            });

            if(typeof $scope.config === 'object' && !$scope.config.length){
                var optionsKeyArray = Object.keys($scope.config.options);
                for (var i in optionsKeyArray) {
                    var currentKey = optionsKeyArray[i].replace(/^allow/, '');
                    var originalKey = optionsKeyArray[i];
                    if(!$scope.config.options[originalKey]){
                        for(var b in $scope.frequency){
                            if($scope.frequency[b].label === currentKey){
                                $scope.frequency.splice(b, 1);
                            }
                        }
                    }
                }
            }

            $scope.minuteValue = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
            $scope.hourValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            $scope.dayOfMonthValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
            $scope.dayValue = [0, 1, 2, 3, 4, 5, 6];
            $scope.monthValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            $scope.$watch('myFrequency', function(n, o){
                //console.log('myFrequency changed: ', n, initChanged);
                if(n && (!o || n.base !== o.base) && !initChanged){
                    //console.log('base changed!', n, o);
                    if(n && n.base){
                        n.base = parseInt(n.base);
                    }
                    if(n && n.base && n.base >= 2) {
                        n.minuteValue = $scope.minuteValue[0];
                    }

                    if(n && n.base && n.base >= 3) {
                        n.hourValue = $scope.hourValue[0];
                    }

                    if(n && n.base && n.base === 4) {
                        n.dayValue = $scope.dayValue[0];
                    }

                    if(n && n.base && n.base >= 5) {
                        n.dayOfMonthValue = $scope.dayOfMonthValue[0];
                    }

                    if(n && n.base && n.base === 6) {
                        n.monthValue = $scope.monthValue[0];
                    }
                } else if(n && n.base && o && o.base){
                    initChanged = false;
                }
                $scope.output = cronService.setCron(n);
            }, true);


        }
    };
}]).filter('numeral', function() {
    return function(input) {
        return input + '.';
        /*
        switch (input) {
            case 1:
                return '1st';
            case 2:
                return '2nd';
            case 3:
                return '3rd';
            case 21:
                return '21st';
            case 22:
                return '22nd';
            case 23:
                return '23rd';
            case 31:
                return '31st';
            case null:
                return null;
            default:
                return input + 'th';
        }*/
    };
}).filter('monthName', function() {
    return function(input) {
        var months = {
            1: 'január',
            2: 'február',
            3: 'március',
            4: 'április',
            5: 'május',
            6: 'június',
            7: 'július',
            8: 'augusztus',
            9: 'szeptember',
            10: 'október',
            11: 'november',
            12: 'december'
        };

        if (input !== null && angular.isDefined(months[input])) {
            return months[input];
        } else {
            return null;
        }
    };
}).filter('dayName', function() {
    return function(input) {
        var days = {
            0: 'vasárnap',
            1: 'hétfőn',
            2: 'kedden',
            3: 'szerdán',
            4: 'csütörtökön',
            5: 'pénteken',
            6: 'szombaton',
        };

        if (input !== null && angular.isDefined(days[input])) {
            return days[input];
        } else {
            return null;
        }
    };
});