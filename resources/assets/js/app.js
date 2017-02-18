'use strict';

/**
 * @ngdoc overview
 * @name jpApp
 * @description
 * # jpApp
 *
 * Main module of the application.
 */
angular
	.module('jpApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch'
	])
	.config(function ($routeProvider,$locationProvider) {
		console.log('Route Provider',$routeProvider);

		$routeProvider
			.when('/',{
				templateUrl	:	'/views/main.html',
				controller	:	'MainCtrl',
				controllerAs	:	'main',
				resolve : {
					init : function($rootScope,location){
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.progress').hide();
						
						if(!$rootScope.user){
							$rootScope.user = {};
						}
						
						//Get Home location of the current user
						if(navigator.geolocation && !$rootScope.user.location) {
							console.log('Location Needed');
							
							$rootScope.user.location =	{};
							
							return location.getLocation().then(function(result){
								
								console.log('Location Result',result);
								
								$rootScope.user.location.location = result[1].formatted_address;
									
								$rootScope.user.location.place_id = result[1].place_id;
								
								$rootScope.$location.title = 'Jobs in '+$rootScope.user.location.location;
								
								Materialize.updateTextFields();
								
								return result;
							});

						}
					}
				}
			})
			.when('/jobs',{
				templateUrl	:	'/views/jobs.html',
				controller	:	'JobsCtrl',
				controllerAs: 	'jobs',
				resolve:	{
					jobsData : function(jobs,$rootScope){
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.progress').show();
						
						return jobs.getData('jobs').then(function(result){
							Materialize.toast('Got some jobs'+result.data.length, 3000);
							console.log('Got some jobs',result);
							angular.element('.progress').hide();
							return result.data;
						});
					}
				}
			})
			.when('/jobs/:jobId',{
				templateUrl	:	'/views/partials/jobs/view-job.html',
				controller	:	'JobCtrl',
				controllerAs: 	'job',
				resolve : {
					
					jobData : function(jobs,$route,$rootScope){
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.progress').show();
						
						return jobs.getData('jobs',$route.current.params.jobId).then(function(result){
							angular.element('.progress').hide();
							return result.data;
						});
					}
				}
			})
			.when('/companies',{
				templateUrl	:	'/views/companies.html',
				controller	:	'CompaniesCtrl',
				controllerAs: 	'Companies',
				resolve : {
					companiesData : function(companies,$route,$rootScope){
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.progress').show();
						
						return companies.getData('companies').then(function(result){
							angular.element('.progress').hide();
							return result.data;
						});
					}
				}
			})
			.when('/companies/:companyId',{
				templateUrl	:	'/views/partials/companies/view-company.html',
				controller	:	'CompanyCtrl',
				controllerAs: 	'Company',
				resolve : {
					
					companyData : function(companies,$route,$rootScope){
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.progress').show();
						
						return companies.getData('companies',$route.current.params.companyId).then(function(result){
							angular.element('.progress').hide();
							return result.data;
						});
					}
				}
			})
			.otherwise({
				templateUrl : 	'Not Found'
			});

	}).run(function() {
		angular.element('.progress').show();
	});
  
