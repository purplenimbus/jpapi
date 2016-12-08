'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobsCtrl', function ($scope,jobs,$routeParams,$route,$location)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		$scope.init	=	function(){
			jobs.getData('jobs').then(function(result){
				console.log('Got some jobs',result);
				$scope.jobs = result.data;
			});
		};
		
		$scope.init();
		
	});
