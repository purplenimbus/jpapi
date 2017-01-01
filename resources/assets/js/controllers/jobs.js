'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobsCtrl', function ($scope,jobs,$routeParams,$route,$location,$compile,$rootScope)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
				
		$rootScope.$location.title = $rootScope.$location.base;
		
		angular.element('.progress').show();
		
		$scope.init	=	function(){
			var str = '';
			jobs.getData('jobs').then(function(result){
				Materialize.toast('Got some jobs'+result.data.length, 3000)
				//console.log('Got some jobs',result);
				$scope.jobs = result.data;
				str	=	'<li class="col m12" ng-repeat="job in jobs" ng-include="\'views/partials/jobs/job.html\'"></li>';
				angular.element('ul.jobs').append($compile(str)($scope));
				angular.element('.progress').hide();
			});
		};
		
		$scope.init();
		
	});
