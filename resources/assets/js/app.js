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
		'ngTouch',
		'ui.router', 
		'satellizer',
		'mapboxgl-directive'
	]).run(function($rootScope,$state,$stateParams,$location,$auth,auth) {
			
		$rootScope.$location = {};
	
		$rootScope.$location.base = $location.path().split('\/')[1];
		
		angular.element('.loader').show();
		
		//console.log('Runtime State',$state);
		//Bind when to rootScope
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		$rootScope.$auth = $auth;
		
		console.log('Runtime RootScope',$rootScope);
		console.log('Logged in?',$rootScope.$auth.isAuthenticated());
		console.log('Logged payload',$rootScope.$auth.getPayload());
		console.log('Logged Token',$rootScope.$auth.getToken());

		var userData = auth.getCookie('auth') ? JSON.parse(auth.getCookie('auth')) : null;
		
		$rootScope.user = {};
		
		$rootScope.$auth.isAuthenticated() && typeof(userData) !== 'undefined' ?
			
			$rootScope.user.info = userData
			
		: null;

	
	}).config(function ($routeProvider,$locationProvider,$stateProvider, $urlRouterProvider, $authProvider) {
		console.log('Route Provider',$routeProvider);
		
		$authProvider.loginUrl = '/api/login';
		
		$authProvider.linkedin({
			clientId: '75835cv03xc5be',
			url: '/api/auth/linkedin'
		});
		
		//$urlRouterProvider.otherwise('/');
		
		$routeProvider
		//$stateProvider
			.when('/',{
				templateUrl	:	'/views/main.html',
				controller	:	'MainCtrl',
				controllerAs	:	'main',
				resolve : {
					init : function($rootScope,accountData){
						console.log('rootScope',$rootScope);
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.loader').hide();
						
						$rootScope.logged_in = false;
					
						var location = accountData.setUserLocation();
						
						$rootScope.$location.title = 'Jobs in '+$rootScope.user.location.location;
														
						angular.element('.loader').hide();
						
						return location;
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
						
						angular.element('.loader').show();
						
						return jobs.getData('jobs').then(function(result){
							console.log('Got some jobs',result);
							angular.element('.loader').hide();
							return result.data.data;
						});
					}
				}
			})
			.when('/jobs/:jobId',{
				templateUrl	:	'/views/partials/jobs/view-job.html',
				controller	:	'JobCtrl',
				controllerAs: 	'job',
				resolve : {
			
					jobData : function(jobs,$route,$rootScope,auth){
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.loader').show();
						
						console.log('$rootScope.user', $rootScope.$auth.isAuthenticated());
						
						return jobs.getData('jobs',$route.current.params.jobId).then(function(result){
							angular.element('.loader').hide();
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
						
						angular.element('.loader').show();
						
						return companies.getData('companies').then(function(result){
							angular.element('.loader').hide();
							return result.data;
						});
					}
				}
			})
			.when('/companies/:companyId',{
				templateUrl	:	'/views/partials/companies/view-company.html',
				controller	:	'CompanyCtrl',
				controllerAs: 	'Company',
				resolve 	: {
					
					companyData : function(companies,$route,$rootScope){
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.loader').show();
						
						return companies.getData('companies',$route.current.params.companyId).then(function(result){
							angular.element('.loader').hide();
							return result.data;
						});
					}
					
				}
			})
			.when('/myaccount',{
				templateUrl	:	'/views/partials/account/view-account.html',
				controller	:	'AccountCtrl',
				controllerAs: 	'Account',
				resolve 	: {
					user : function(accountData,$rootScope,auth){
												
						var user_id = JSON.parse(auth.getCookie('auth')).id;
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						return accountData.getUserData(user_id).then(function(result){
						
							angular.element('.loader').hide();
						
							return result;
						}).catch(function(error){
							console.log('Error',error);
						});
					}
				}
			})
			.when('/myaccount/edit',{
				template	:	function(d){
					//console.log('Edit Profile',d);
					return form.editProfile();
				},
				controller	:	'AccountCtrl',
				controllerAs: 	'Account',
				resolve 	: {
					user : function(accountData,$rootScope){
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						return accountData.getUserData().then(function(result){
							console.log('Result',result);
						
							angular.element('.loader').hide();
						
							return result;
						}).catch(function(error){
							console.log('Error',error);
						});
					}
				}
			})
			.otherwise({
				templateUrl : 	'Not Found'
			});
   
			$stateProvider
			.state('/myaccount',{
				templateUrl	:	'/views/partials/account/account.html',
				controller	:	'AccountCtrl',
				controllerAs: 	'Account',
				resolve 	: {
					accountData : function(accountDataService){
						return accountDataService.then(function(result){
							console.log('Result',result);
							return result;
						}).catch(function(error){
							console.log('Error',error);
						});
					}
				}
			});

	}).filter('trusted', function ($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	}).filter('moment', function () {
		return function(val,format) {
			var relative_str;
			
			//relative_str = moment(val, (format ? format : "YYYYMMDD")).fromNow();
			
			relative_str = moment(val).fromNow();
			
			return relative_str;
		};
	}).constant('mapSettings', function() {
		return {
			styleUrl : 'mapbox://styles/purplenimbus/cj59voeq26auw2snweqgxunkf'
		};
	});
  
