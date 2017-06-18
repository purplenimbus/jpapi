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
		'satellizer'
	])
	.config(function ($routeProvider,$locationProvider,$stateProvider, $urlRouterProvider, $authProvider) {
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
					init : function($rootScope,location){
						console.log('rootScope',$rootScope);
						$rootScope.$location.title = $rootScope.$location.base;
						
						angular.element('.progress').hide();
						
						$rootScope.logged_in = false;
		
						angular.element(".dropdown-button").dropdown();
						angular.element(".account-collapse").sideNav();
					
						
						if(!$rootScope.user){
							$rootScope.user = {};
						}
						
						//Get Home location of the current user
						if(navigator.geolocation && !$rootScope.user.location) {
							//console.log('Location Needed');
							
							$rootScope.user.location =	{};
							
							return location.getLocation().then(function(result){
								
								console.log('Location Result',result);
								
								$rootScope.user.location.location = result[1].formatted_address;
									
								$rootScope.user.location.place_id = result[1].place_id;
								
								$rootScope.$location.title = 'Jobs in '+$rootScope.user.location.location;
								
								Materialize.updateTextFields();
								
								angular.element('.progress').hide();
																
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
							Materialize.toast('Got '+result.data.length+' Jobs', 3000);
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
				resolve 	: {
					
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
			.when('/myaccount',{
				templateUrl	:	'/views/partials/account/view-account.html',
				controller	:	'AccountCtrl',
				controllerAs: 	'Account',
				resolve 	: {
					user : function(accountData,$rootScope,auth){
												
						var user_id = JSON.parse(auth.getCookie('auth')).id;
						
						$rootScope.$location.title = $rootScope.$location.base;
						
						return accountData.getUserData(user_id).then(function(result){
						
							angular.element('.progress').hide();
						
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
						
							angular.element('.progress').hide();
						
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

	}).run(function($rootScope,$state,$stateParams,$location,$auth,auth) {
			
		$rootScope.$location = {};
	
		$rootScope.$location.base = $location.path().split('\/')[1];
		
		angular.element('.progress').show();
		
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

	
	}).filter('trusted', function ($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	});
  
