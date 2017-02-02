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
				str	=	'<a href="#jobs/{{ job.id }}" class="collection-item" ng-repeat="job in jobs">{{ job.title }}</a>';
				angular.element('div.jobs').append($compile(str)($scope));
				angular.element('.progress').hide();
			});
		};
		
		$scope.init();
		
	});
