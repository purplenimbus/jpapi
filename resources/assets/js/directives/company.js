'use strict';

/**
 * @ngdoc directive
 * @name jpApp.wordpress
 * @description
 * # wordpress
 * Service in the jpApp.
 */
angular.module('jpApp')
	.directive('companyCard', function ($http,elements,$rootScope,$auth,wordpress) {
		 return {
			templateUrl: '/views/partials/companies/company-card.html',
			restrict: 'E',
			scope: true,
			controller : function($scope,wordpress){
				$scope.loading = true;
				
				console.log('Company Directive Scope',$scope);
				
				$scope.init = function(){
					wordpress.getData('companies',$scope.$parent.currentAsset.meta.wp_company_id).then(function(result){
						
						console.log('Company result',result);
						
						$scope.name = result.data.title.rendered;
						
						$scope.meta = result.data.meta;
						
						$scope.jobs = result.data.jobs;
						
						$scope.loading = false;
														
					}).catch(function(error){
						console.log('get jobs error',error);
						$scope.loading = false;
						$scope.show_card = false;
					});
				}
				
				$scope.init();
			}	
		};
	});