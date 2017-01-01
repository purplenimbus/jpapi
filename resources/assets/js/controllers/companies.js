'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('CompaniesCtrl', function ($scope,jobs,companies,$routeParams,$route,$location,$compile,$rootScope)
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
			companies.getData('companies').then(function(result){
				Materialize.toast('Got some companies'+result.data.length, 3000);
				$scope.companies = result.data;
				str	=	'<li class="col m12" ng-repeat="company in companies" ng-include="\'views/partials/companies/company.html\'"></li>';
				angular.element('ul.companies').append($compile(str)($scope));
				angular.element('.progress').hide();
			});
		};
		
		$scope.init();
		
	});
