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
			
			relative_str = moment(val, (format ? format : "YYYYMMDD")).fromNow();
			
			return relative_str;
		};
	}).constant('mapSettings', function() {
		return {
			styleUrl : 'mapbox://styles/purplenimbus/cj59voeq26auw2snweqgxunkf'
		};
	});
  

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('AccountCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope,form,user,accountData,auth)
	{
				
		this.user = JSON.parse(auth.getCookie('auth'));
						
		var AccountCtrl = this;
		
		console.log('User',user);
								
		$scope.currentAsset = user.data[0].resume ? JSON.parse(user.data[0].resume) : { experience:[],education:[]};
		
		$scope.currentAsset.user = AccountCtrl.user;
		
		var autocomplete;
	
		//angular.element('ul.tabs').tabs(); //Initialize Tabs
				
		/**
		 * Edit User Profile
		 */
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4>Edit Profile</h4>';
			//modalTitle	+=	'<div class="right">'+elements.form.check({name : 'status' , model:'currentAsset.status',colSize: 12,label1:'draft',label2:'published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'reset()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateProfile()'	, label : 'Save'});
			
			modalBody	=	form.editProfile();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				//Input elements need to converted to directives
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'job_description' ).on( 'change', function( evt ) {
					JobCtrl.currentAsset.description = evt.editor.getData();
				});
				
				angular.element('.chips-autocomplete').material_chip();
				
				angular.element('.chips-autocomplete').material_chip({
					placeholder: 'Skills',
					autocompleteData: {
					  'Apple': null,
					  'Microsoft': null,
					  'Google': null
					}
				});
				
				angular.element('.chips-autocomplete').on('chip.add', function(e, chip){
					JobCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					JobCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				});
					
				console.log(elements.form.bloodhound('/api/job_skills').index.datums);
				
				// Create the autocomplete object, restricting the search to geographical
				// location types.
				autocomplete = new google.maps.places.Autocomplete(
					/** @type {!HTMLInputElement} */(angular.element('input#job_location').get(0)),
					{types: ['geocode']});

				// When the user selects an address from the dropdown, populate the address
				// fields in the form.
				autocomplete.addListener('place_changed', function(){
					var place = this.getPlace();
					
					console.log('Place',place);
					//console.log('Place Long',place.geometry.location.lng());
					
					JobCtrl.currentAsset.location = { searched : true };
					
					JobCtrl.currentAsset.location.name = place.formatted_address;//place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						console.log('Value',value);
						JobCtrl.currentAsset.location[value.types[0]] = {};
						JobCtrl.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						JobCtrl.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
					JobCtrl.currentAsset.location.place_id = place.place_id ? place.place_id : '';
					JobCtrl.currentAsset.location.vicinity = place.vicinity ? place.vicinity : '';
						
					//Set location long lat
					JobCtrl.currentAsset.location.geo = { 
															lng : place.geometry.location.lng(), 
															lat	: place.geometry.location.lat(),
															url : place.url
														};
					//Set url
					console.log('Location Asset',JobCtrl.currentAsset.location);
				});
				
				var slider = angular.element('#pay').get(0);
				//console.log('Salary',parseInt($scope.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')));				
				//console.log('Salary Scope',$scope);				
				
				noUiSlider.create(slider, {
					start: JobCtrl.currentAsset.salary ? [parseInt(JobCtrl.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')), 
							parseInt(JobCtrl.currentAsset.salary.split(',')[1].toString().replace(/$$|.000/g,''))] : [0,100],
					connect: true,
					step: 5,
					range: {
						'min': 0,
						'max': 1000
					},
					format: wNumb({
						decimals: 0,
						thousand: '.',
						//prefix: '$',
						postfix: '.000'
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					console.log('Slider Changed',value.toString());
					JobCtrl.currentAsset.pay.value  = value;
					JobCtrl.currentAsset.salary  = value.toString();
					JobCtrl.currentAsset.pay.min = value[0];
					angular.element('.range-field span.min').html(value[0]);
					JobCtrl.currentAsset.pay.max  = value[1];
					angular.element('.range-field span.max').html(value[1]);
				});
				
				//Initalize Datepicker
				angular.element('.datepicker').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
					
					angular.element('#'+name).pickadate({
						selectMonths: true, // Creates a dropdown to control month
					}).on('change',function(e){
						$scope.currentAsset[name] = new Date(angular.element(e.currentTarget).val());
					});
				
				});
				
				//Initalize Typeahead
				angular.element('.typeahead').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
										
					angular.element('#'+name).typeahead(null, {
						name: name,
						display: 'name',
						source: elements.form.bloodhound('/api/'+name).ttAdapter(),
						hint: true,
						highlight: true,
						minLength: 0,
						limit: 10,
						templates: {
							empty: [
								'<div class="tt-suggestion tt-empty-message collection">',
								'No results were found ...',
								'</div>'
							].join('\n'),
							//header: '<div class="collection-header"><h6>'+name+'</h6></div>'
							//suggestion: Handlebars.compile('<div class="collection-item">{{value}}</div>')
						},
						classNames: {
							selectable: 'collection-item',
							dataset : 'collection'
						},
						//identify: function(obj) { return obj.name; },
					}).bind('typeahead:select', function(ev, suggestion) {
						var asset = angular.element(ev.currentTarget).get(0).dataset.asset;
						//console.log('Selection(name): ' + suggestion.name);
						//console.log('Selection(id): ' + suggestion.id);
						//console.log('event: ' + asset);
						JobCtrl.currentAsset[asset] = suggestion;
						//$scope.currentAsset[asset].name = suggestion.name;
						
						console.log('Scope asset(id): ' + JobCtrl.currentAsset[asset].id);
						console.log('Scope asset(name): ' + JobCtrl.currentAsset[asset].name);
						//$scope.currentAsset
					});
				});
				
				console.log('Check current asset',JobCtrl.currentAsset.status === 1);
				
				JobCtrl.currentAsset.status === 1 ? angular.element('#status').get(0).checked = true : null;
				
			});
		}
		
		/**
		 * Save User Profile
		 */
		$scope.updateProfile = function(){
			var self = this;
								
			accountData.saveData(AccountCtrl.user.id,$scope.currentAsset).then(function(result){
				console.log(result);
				$scope.reset();
			}).catch(function(error){
				console.log(error);
				//TO DO : DO Something if updating profile fails
			});
		}
		
		/**
		 * Reset Page
		 */
		$scope.reset = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentAsset = $scope.cache;
			$route.reload();
		}
		/**
		 * Add New Experience field when editing profile
		 */
		$scope.addExperience = function(){
			$scope.currentAsset.experience.push({});
		}
		
		/**
		 * Delete Experience field when editing profile
		 * 
		 * @param {int} index - array index 
		 * 
		 */
		$scope.removeExperience = function(index){
			console.log('removeExperience',index);
			$scope.currentAsset.experience.splice(index,1);
		}
		
		/**
		 * Add New Education field when editing profile
		 */
		$scope.addEducation = function(){
			$scope.currentAsset.education.push({});
		}
		
		/**
		 * Delete Education field when editing profile
		 * 
		 * @param {int} index - array index 
		 * 
		 */
		$scope.removeEducation = function(index){
			console.log('removeEducation',index);
			$scope.currentAsset.education.splice(index,1);
		}
	});

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('AuthCtrl', function ($auth,$state,$rootScope,$scope,validation,form,elements,modal,jobs,companies,$location,$route,auth,$window) {
		
		//$rootScope.loggedIn = false; //Initialize logged in flag
		
        $scope.login = function($event) {
			
			//$event.preventDefault();
			
			var modalContent	=	angular.element($event.currentTarget).parents()[1],
				form			=	angular.element(modalContent).find('form').serializeArray(),
				credentials		=	{
					email		:	$scope.email,
					password	: 	$scope.password
				};
			
			console.log('Login Details',credentials);
				
			validation.validate(form).then(function(result){
				
				console.log(result);
				angular.element('#modal .uk-modal-spinner').removeClass('uk-hidden');
				if(result.valid){											
					//Use Satellizer's $auth service to login
					$auth.login(credentials).then(function(result) {
						console.log('Data',result);
						
						angular.element('#modal .uk-modal-dialog').removeClass('error')
												.addClass('success');
												
						angular.element('#modal .uk-alert')
								.removeClass('uk-hidden uk-alert-danger')
								.addClass('uk-alert-success')
								.children('p')
								.html('Logged In Successfully'); //Show Success Alert
								
						$rootScope.user = {};
						console.log('Logged in Rootscope',$rootScope);
						console.log('Logged in Auth',$auth.isAuthenticated());
						console.log('Logged in token',$auth.getToken());
						console.log('Logged in payload',$auth.getPayload());
						auth.setCookie('auth',JSON.stringify(result.data.user),9);
						$rootScope.user.info = result.data.user;
						angular.element('#modal .uk-modal-spinner').addClass('uk-hidden');//remove spinner
						$scope.closeModal();
						$route.reload();

						
					}).catch(function(error){
						console.log('Login Error',error);
						//TO DO Add Error Message to login modal
						angular.element('#modal .uk-modal-dialog').removeClass('success')
												.addClass('error');
												
						angular.element('#modal .uk-modal-spinner').addClass('uk-hidden'); //remove spinner
						angular.element('#modal .uk-alert')
								.removeClass('uk-hidden uk-alert-success')
								.addClass('uk-alert-danger')
								.children('p')
								.html('Invalid Login');//Add error message
					});
					
				}else{
					console.log(result);
					//TO DO Add Validation Error Message to login modal
				}	
				
			});
			
            
        };
		
		$scope.showLoginModal	=	function(){
			var modalType	=	'login',
				modalTitle	=	'',
				modalBody	=	form.login(),
				modalFooter	=	'';//elements.button({	type	:	'submit',	cls:	'btn teal accent-3',	ngClick	:	'login($event)'	},'Login');
				
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				//console.log(result);
				console.log('Auth Details',$rootScope);
				
			});
		};
		
		$scope.authenticate = function(provider) {
			$auth.authenticate(provider).then(function(result){
				console.log('Auth Data',result);
						
				angular.element('#modal .uk-modal-dialog').removeClass('error')
										.addClass('success');
										
			angular.element('#modal.login form input')
					.removeClass('uk-form-danger')
					.addClass('uk-form-success');
										
				angular.element('#modal .uk-alert')
						.removeClass('uk-hidden uk-alert-danger')
						.addClass('uk-alert-success')
						.children('p')
						.html('Logged In Successfully'); //Show Success Alert
						
						
				$rootScope.user = {};
				console.log('Logged in Rootscope',$rootScope);
				console.log('Logged in Auth',$auth.isAuthenticated());
				console.log('Logged in token',$auth.getToken());
				console.log('Logged in payload',$auth.getPayload());
				auth.setCookie('auth',JSON.stringify(result.data.token),9);
				$rootScope.user.info = result.data.user;
				angular.element('#modal .uk-modal-spinner').addClass('uk-hidden');//remove spinner
				$scope.closeModal();
				$route.reload();
				
			}).catch(function(error){
				//handle error
				//console.log('Login Error',error);
				//TO DO Add Error Message to login modal
				angular.element('#modal .uk-modal-dialog').removeClass('success')
										.addClass('error');
										
				angular.element('#modal.login form input')
					.removeClass('uk-form-success')
					.addClass('uk-form-danger');
										
				angular.element('#modal .uk-modal-spinner').addClass('uk-hidden'); //remove spinner
				angular.element('#modal .uk-alert')
						.removeClass('uk-hidden uk-alert-success')
						.addClass('uk-alert-danger')
						.children('p')
						.html(error);//Add error message
			});
		};
		
		$scope.logout = function() {
			$auth.logout();
			
			//$location.path("/");
		};
		
		$scope.closeModal	=	function(){
			angular.element('#modal').hide().remove();
		};
	
	});

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('CompaniesCtrl', function ($scope,jobs,companies,$routeParams,$route,$location,$compile,$rootScope,companiesData)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		$scope.companies = this.companies = companiesData;
		
		console.log('Companies ',this.companies);
	});
'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # CompanysCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('CompanyCtrl', function ($scope,companies,jobs,$route,$location,$filter,modal,elements,$rootScope,form,companyData,$window,accountData)
	{
		
		var autocomplete,CompanyCtrl = this;
		
		this.data = {};
		
		console.log($route);
		
		$scope.currentAsset = CompanyCtrl.currentAsset = companyData;
		
		console.log('Company Updates',$scope.currentAsset,$window);
		
		if(!$rootScope.user.location){
			accountData.setUserLocation().then(function(result){
				console.log('setUserLocation',result);
				console.log('User Root Geo',$rootScope.user.location);
				
				var home = new mapboxgl.LngLat(result[1].geometry.location.lng(), result[1].geometry.location.lat());
				
				console.log('User Home Geo',home);
				
				var map = new mapboxgl.Map({
					container: 'map',
					style: 'mapbox://styles/purplenimbus/cj59u1c0r69x52sl0qejv56mm',
					center: home,
					zoom: 10
				});
								
				// Add geolocate control to the map.
				map.addControl(new mapboxgl.GeolocateControl());
				
				map.on('load', function () {
					if(CompanyCtrl.currentAsset.location){
						var marker = new mapboxgl.Marker()
								  .setLngLat([parseInt(CompanyCtrl.currentAsset.location.lng), parseInt(CompanyCtrl.currentAsset.location.lat)])
								  .addTo(map);
					}					
				});
			});
		}
		
		$scope.companyOptions = function(options) {
			switch(options){
				case 'company_status' :  return function(){
					var selected = $filter('filter')($rootScope.company.options.company_status, {value: CompanyCtrl.currentAsset.status});
					return (CompanyCtrl.currentAsset.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.updateCompany = function(){			
			
			this.data	=	{
				id : CompanyCtrl.currentAsset.id,
				name : CompanyCtrl.currentAsset.name,
				description : CompanyCtrl.currentAsset.description,
				company_category_id : CompanyCtrl.currentAsset.company_category.id,
				email : CompanyCtrl.currentAsset.email,
				address : CompanyCtrl.currentAsset.address,
				zipcode	: CompanyCtrl.currentAsset.zipcode,
				phone : CompanyCtrl.currentAsset.phone,
				logo : CompanyCtrl.currentAsset.logo,
				status : CompanyCtrl.currentAsset.status
			}
			
			console.log('Data',this.data);
			
			companies.sendData('companies',$route.current.params.companyId,this.data).then(function(result){
				console.log('Got a Response',result);
				$scope.cancel();
				////$scope.currentAsset = result.data;
			});
			
		}
		
		$scope.cancel = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentAsset = $scope.cache;
			$route.reload();
		}
		
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Company</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'company_category' , model:'currentAsset.status',colSize: 12,label1:'Draft',label2:'Published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'cancel()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateCompany()'	, label : 'Save'});
			
			modalBody	=	form.editCompany();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'company_description' ).on( 'change', function( evt ) {
					CompanyCtrl.currentAsset.description = evt.editor.getData();
				});
				
				/*
				angular.element('.chips-initial').on('chip.add', function(e, chip){
					CompanyCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					CompanyCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).material_chip({
					placeholder: 'Skills',
					data: CompanyCtrl.currentAsset.required_skills
				});
				*/
				
				// Create the autocomplete object, restricting the search to geographical
				// location types.
				autocomplete = new google.maps.places.Autocomplete(
					/** @type {!HTMLInputElement} */(angular.element('input#company_location').get(0)),
					{types: ['geocode']});

				// When the user selects an address from the dropdown, populate the address
				// fields in the form.
				autocomplete.addListener('place_changed', function(){
					var place = this.getPlace();
					
					//console.log('Place',place);
					
					CompanyCtrl.currentAsset.location.name = place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						//console.log('Value',value);
						CompanyCtrl.currentAsset.location[value.types[0]] = {};
						CompanyCtrl.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						CompanyCtrl.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
				});
				
				var slider = angular.element('#employees').get(0);
				
				//Initalize Typeahead
				angular.element('.typeahead').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
					
					console.log('Company Cats Bloodhound',elements.form.bloodhound('/company/categories'));
					
					angular.element('#'+name).typeahead(null, {
						name: name,
						display: 'name',
						source: elements.form.bloodhound('/company/categories').ttAdapter(),
						hint: true,
						highlight: true,
						minLength: 0,
						limit: 10,
						templates: {
							empty: [
								'<div class="tt-suggestion tt-empty-message collection">',
								'No results were found ...',
								'</div>'
							].join('\n'),
							//header: '<div class="collection-header"><h6>'+name+'</h6></div>'
							//suggestion: Handlebars.compile('<div class="collection-item">{{value}}</div>')
						},
						classNames: {
							selectable: 'collection-item',
							dataset : 'collection'
						},
						//identify: function(obj) { return obj.name; },
					}).bind('typeahead:select', function(ev, suggestion) {
						var asset = angular.element(ev.currentTarget).get(0).dataset.asset;
						//console.log('Selection(name): ' + suggestion.name);
						//console.log('Selection(id): ' + suggestion.id);
						//console.log('event: ' + asset);
						CompanyCtrl.currentAsset[asset] = suggestion;
						//$scope.currentAsset[asset].name = suggestion.name;
						
						console.log('Scope asset(id): ' + CompanyCtrl.currentAsset[asset].id);
						console.log('Scope asset(name): ' + CompanyCtrl.currentAsset[asset].name);
						//$scope.currentAsset
					});
				});
			});
		}
		
	});

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobCtrl
 * @description
 * # JobCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope,form,jobData,accountData,auth,$auth,$timeout)
	{
		
		var JobCtrl = this;
		
		$rootScope.$location.title = '';
		
		var autocomplete;
		
		JobCtrl.data = {};
		
		console.log('jobData',jobData);
		
		$scope.currentAsset = JobCtrl.currentAsset = jobData;
		
		JobCtrl.cache = JobCtrl.currentAsset;//Make a copy of the currentAsset
		
		JobCtrl.currentAsset.pay = {}; //Initalize pay object
		
		console.log('Got a job',JobCtrl.currentAsset);
		
		//Parse Date for HTML 5 date element
		JobCtrl.currentAsset.application_deadline ? 
			JobCtrl.currentAsset.application_deadline = new Date(JobCtrl.currentAsset.application_deadline)
			: null;
			
		$rootScope.$location.title = JobCtrl.currentAsset.title;
		
		JobCtrl.jobOptions = function(options) {
			switch(options){
				case 'job_status' :  return function(){
					var selected = $filter('filter')($rootScope.job.options.job_status, {value: JobCtrl.currentAsset.status});
					return (JobCtrl.currentAsset.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.showMap = true;
		
		if(!$rootScope.user.location){
			accountData.setUserLocation().then(function(result){
				console.log('setUserLocation',result);
				console.log('User Root Geo',$rootScope.user.location);
				
				var home = new mapboxgl.LngLat(result[1].geometry.location.lng(), result[1].geometry.location.lat());
				
				console.log('User Home Geo',home);
				
				var map = mapboxgl.Map({
					//container: 'map',
					style: 'mapbox://styles/purplenimbus/cj59u1c0r69x52sl0qejv56mm',
					center: home,
					zoom: 10
				});
								
				// Add geolocate control to the map.
				map.addControl(new mapboxgl.GeolocateControl());
				
				map.on('load', function () {
					if(JobCtrl.currentAsset.location){
						var marker = new mapboxgl.Marker()
					  .setLngLat([parseInt(JobCtrl.currentAsset.location.lng), parseInt(JobCtrl.currentAsset.location.lat)])
					  .addTo(map);
					}					
				});
				
				/*$scope.$on('mapboxglMap:load', function (angularEvent, mapboxglEvent) {
				   console.log('Map Loaded',angularEvent,mapboxglEvent);
				});*/
			});
		}		
		/**
		 * Update Job
		 */
		$scope.updateJob = function(){			
			
			console.log('Scope Data',JobCtrl.currentAsset);
			
			JobCtrl.data	=	{
				id : JobCtrl.currentAsset.id,
				title : JobCtrl.currentAsset.title,
				description : JobCtrl.currentAsset.description,
				//company_id : JobCtrl.currentAsset.company ? JobCtrl.currentAsset.company.id : null,
				job_category_id : JobCtrl.currentAsset.job_category.id,
				job_type_id : JobCtrl.currentAsset.job_type.id,
				job_level_id : JobCtrl.currentAsset.job_level.id,
				job_salary_id : $scope.currentAsset.salary_type ? $scope.currentAsset.salary_type.id : null,
				application_deadline : JobCtrl.currentAsset.application_deadline ? JobCtrl.currentAsset.application_deadline : null,
				salary : JobCtrl.currentAsset.salary,
				status : JobCtrl.currentAsset.status,
				min_experience : JobCtrl.currentAsset.min_experience,
				min_qualification : JobCtrl.currentAsset.min_qualification.name,
			}
			
			JobCtrl.currentAsset.location = {}; //Temp work around for testing
			
			if(JobCtrl.currentAsset.location.searched){
				JobCtrl.data.location = {
					name : JobCtrl.currentAsset.location.name,
					locality : JobCtrl.currentAsset.location.neighborhood ? JobCtrl.currentAsset.location.neighborhood.long_name : JobCtrl.currentAsset.location.vicinity,
					city	:	JobCtrl.currentAsset.location.locality.long_name,
					city_code	:	JobCtrl.currentAsset.location.locality.long_name,
					state	:	JobCtrl.currentAsset.location.administrative_area_level_1.long_name ? JobCtrl.currentAsset.location.administrative_area_level_1.long_name : '',
					state_code	:	JobCtrl.currentAsset.location.administrative_area_level_1.short_name ? JobCtrl.currentAsset.location.administrative_area_level_1.short_name : '',
					country	:	JobCtrl.currentAsset.location.country.long_name ? JobCtrl.currentAsset.location.country.long_name : '',
					country_code	: JobCtrl.currentAsset.location.country.short_name ? JobCtrl.currentAsset.location.country.short_name : '',
					lng	:	JobCtrl.currentAsset.location.geo.lng,
					lat	:	JobCtrl.currentAsset.location.geo.lat,
					ref_id	:	JobCtrl.currentAsset.location.place_id,
					url	:	JobCtrl.currentAsset.location.geo.url,
					zip_code : JobCtrl.currentAsset.location.zipcode ? JobCtrl.currentAsset.location.zipcode : ''
				}
			}
			
			console.log('Data',JobCtrl.data);
			
			jobs.sendData('jobs',$route.current.params.jobId,JobCtrl.data).then(function(result){
				console.log('Got a Response',result);
				JobCtrl.reset();
			});
			
		}
		/**
		 * Reset Page
		 */
		JobCtrl.reset = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentAsset = $scope.cache;
			$route.reload();
		}
		
		/**
		 * Edit Job
		 */
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Job</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'status' , model:'currentAsset.status',colSize: 12,label1:'draft',label2:'published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'reset()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateJob()'	, label : 'Save'});
			
			modalBody	=	form.editJob();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				//Input elements need to converted to directives
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'job_description' ).on( 'change', function( evt ) {
					JobCtrl.currentAsset.description = evt.editor.getData();
				});
				
				angular.element('.chips-autocomplete').material_chip();
				
				angular.element('.chips-autocomplete').material_chip({
					placeholder: 'Skills',
					autocompleteData: {
					  'Apple': null,
					  'Microsoft': null,
					  'Google': null
					}
				});
				
				//angular.element("#required_skills").tagit();
				
				angular.element('.chips-autocomplete').on('chip.add', function(e, chip){
					JobCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					JobCtrl.currentAsset.required_skills = angular.element(this).material_chip('data');
				});
					
				console.log(elements.form.bloodhound('/api/job_skills').index.datums);
				
				// Create the autocomplete object, restricting the search to geographical
				// location types.
				autocomplete = new google.maps.places.Autocomplete(
					/** @type {!HTMLInputElement} */(angular.element('input#job_location').get(0)),
					{types: ['geocode']});

				// When the user selects an address from the dropdown, populate the address
				// fields in the form.
				autocomplete.addListener('place_changed', function(){
					var place = this.getPlace();
					
					console.log('Place',place);
					//console.log('Place Long',place.geometry.location.lng());
					
					JobCtrl.currentAsset.location = { searched : true };
					
					JobCtrl.currentAsset.location.name = place.formatted_address;//place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						console.log('Value',value);
						JobCtrl.currentAsset.location[value.types[0]] = {};
						JobCtrl.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						JobCtrl.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
					JobCtrl.currentAsset.location.place_id = place.place_id ? place.place_id : '';
					JobCtrl.currentAsset.location.vicinity = place.vicinity ? place.vicinity : '';
						
					//Set location long lat
					JobCtrl.currentAsset.location.geo = { 
															lng : place.geometry.location.lng(), 
															lat	: place.geometry.location.lat(),
															url : place.url
														};
					//Set url
					console.log('Location Asset',JobCtrl.currentAsset.location);
				});
				
				var slider = angular.element('#pay').get(0);
				//console.log('Salary',parseInt($scope.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')));				
				//console.log('Salary Scope',$scope);				
				
				noUiSlider.create(slider, {
					start: JobCtrl.currentAsset.salary ? [parseInt(JobCtrl.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')), 
							parseInt(JobCtrl.currentAsset.salary.split(',')[1].toString().replace(/$$|.000/g,''))] : [0,100],
					connect: true,
					step: 5,
					range: {
						'min': 0,
						'max': 1000
					},
					format: wNumb({
						decimals: 0,
						thousand: '.',
						//prefix: '$',
						postfix: '.000'
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					console.log('Slider Changed',value.toString());
					JobCtrl.currentAsset.pay.value  = value;
					JobCtrl.currentAsset.salary  = value.toString();
					JobCtrl.currentAsset.pay.min = value[0];
					angular.element('.range-field span.min').html(value[0]);
					JobCtrl.currentAsset.pay.max  = value[1];
					angular.element('.range-field span.max').html(value[1]);
				});
				
				
				angular.element('.datepicker').pickadate({
					selectMonths: true, // Creates a dropdown to control month
				}).on('change',function(e){
					JobCtrl.currentAsset.application_deadline = new Date(angular.element(e.currentTarget).val());
				});
				
				
				//Initalize Typeahead
				angular.element('.typeahead').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
										
					angular.element('#'+name).typeahead(null, {
						name: name,
						display: 'name',
						source: elements.form.bloodhound('/api/'+name).ttAdapter(),
						hint: true,
						highlight: true,
						minLength: 0,
						limit: 10,
						templates: {
							empty: [
								'<div class="tt-suggestion tt-empty-message collection">',
								'No results were found ...',
								'</div>'
							].join('\n'),
							//header: '<div class="collection-header"><h6>'+name+'</h6></div>'
							//suggestion: Handlebars.compile('<div class="collection-item">{{value}}</div>')
						},
						classNames: {
							selectable: 'collection-item',
							dataset : 'collection'
						},
						//identify: function(obj) { return obj.name; },
					}).bind('typeahead:select', function(ev, suggestion) {
						var asset = angular.element(ev.currentTarget).get(0).dataset.asset;
						//console.log('Selection(name): ' + suggestion.name);
						//console.log('Selection(id): ' + suggestion.id);
						//console.log('event: ' + asset);
						JobCtrl.currentAsset[asset] = suggestion;
						//$scope.currentAsset[asset].name = suggestion.name;
						
						console.log('Scope asset(id): ' + JobCtrl.currentAsset[asset].id);
						console.log('Scope asset(name): ' + JobCtrl.currentAsset[asset].name);
						//$scope.currentAsset
					});
				});
				
				console.log('Check current asset',JobCtrl.currentAsset.status === 1);
				
				JobCtrl.currentAsset.status === 1 ? angular.element('#status').get(0).checked = true : null;
				
			});
		}
		/**
		 * Apply to Job
		 * @param {integer} id  - The name of the PUT/POST endpoint
		 */
		$scope.apply	=	function(id,user_id){
			if(!$auth.isAuthenticated()){
				$timeout(function(){
					angular.element('button#login').trigger('click');
				});
			}else{
				$scope.loading = true;
				jobs.sendData('jobs',id+'/apply').then(function(result){
					console.log('Application Result',result);
					if(result.status === 200){
						$scope.currentAsset.user_applied = true;
						$scope.loading = false;
					}else{
						//handle error
					}
				}).catch(function(error){
					console.log('Application Error',error);
					//TO DO  DO something
				});
			}
		}
	});

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('JobsCtrl', function ($scope,jobs,$routeParams,$route,$location,$compile,$rootScope,jobsData,accountData,mapSettings)
	{
		var JobsCtrl = this;
		
		JobsCtrl.jobs = jobsData;
		
		$scope.showMap = true;
		
		if(!$rootScope.user.location){
			accountData.setUserLocation().then(function(result){
				//console.log('setUserLocation',result);
				//console.log('User Root Geo',$rootScope.user.location);
				
				$scope.home = new mapboxgl.LngLat(result[1].geometry.location.lng(), result[1].geometry.location.lat());
				
				$scope.mapStyle = mapSettings().styleUrl;
				
				var features = [];
				
				$scope.$on('mapboxglMap:load', function (angularEvent, mapboxglEvent) {
				   	console.log('Map Loaded',angularEvent,mapboxglEvent);
				});
				
				   var map = new mapboxgl.Map({
						container: 'map',
						//style: 'mapbox://styles/purplenimbus/cj59voeq26auw2snweqgxunkf',
						center: $scope.home,
						zoom: 10
					});
					
					console.log('mapSettings map',map);
					console.log('mapSettings scope',$scope);
				
				//console.log('mapSettings mapboxgl',mapboxgl.Map());
				
				var glPopups = {
					coordinates: $scope.home,
					message: 'HEEEEELLLOOO',
					options: {}, // Optional --> https://www.mapbox.com/mapbox-gl-js/api/#Popup
					getScope: Function, // Default $rootScope
					onClose: function (event, popupClosed) {
					  // ...
					}
				};
				
				/*angular.forEach(JobsCtrl.jobs,function(value){
					if(value.location){
						features.push({
							"type": "Feature",
							"properties": {
								"description": value.description,
								"icon": "theatre"
							},
							"geometry": {
								"type": "Point",
								"coordinates": [parseFloat(value.location.lng), parseFloat(value.location.lat)]
							}
						});
					}
				});
				
				console.log('Jobs features',features);
				
				$scope.glControls = {
				   navigation: {
					  enabled: true | false,
					  options: {} // Navigation control options --> https://www.mapbox.com/mapbox-gl-js/api/#Navigation
				   },
				   scale: {
					  enabled: true | false,
					  options: {} // Scale control options --> https://www.mapbox.com/mapbox-gl-js/api/#Scale
				   },
				   attribution: {
					  enabled: true | false,
					  options: {} // Attribution control options --> https://www.mapbox.com/mapbox-gl-js/api/#Attribution
				   },
				   geolocate: {
					  enabled: true | false,
					  options: {} // Geolocate control options --> https://www.mapbox.com/mapbox-gl-js/api/#Geolocate
				   },
				   geocoder: {
					  enabled: true | false,
					  options: {} // Geocoder control options --> https://github.com/mapbox/mapbox-gl-geocoder/blob/master/API.md
				   },
				   directions: {
					  enabled: true | false,
					  options: {} // Directions control options --> https://github.com/mapbox/mapbox-gl-directions/blob/master/API.md#mapboxgldirections
				   },
				   draw: {
					  enabled: true | false,
					  options: {} // Draw control options -> https://github.com/mapbox/mapbox-gl-draw/blob/master/API.md#options
				   }
				};
				
				$scope.$on('mapboxglMap:load', function (angularEvent, mapboxglEvent) {
				   console.log('Map Loaded',angularEvent,mapboxglEvent);
				});
				/*map.on('load', function () {
					map.addLayer({
						"id": "places",
						"type": "symbol",
						"source": {
							"type": "geojson",
							"data": {
								"type": "FeatureCollection",
								"features": features
							}
						},
						"layout": {
							"icon-image": "{icon}-15",
							"icon-allow-overlap": true
						}
					});
					
					 // When a click event occurs on a feature in the places layer, open a popup at the
					// location of the feature, with description HTML from its properties.
					map.on('click', 'places', function (e) {
						new mapboxgl.Popup()
							.setLngLat(e.features[0].geometry.coordinates)
							.setHTML(e.features[0].properties.description)
							.addTo(map);
					});

					// Change the cursor to a pointer when the mouse is over the places layer.
					map.on('mouseenter', 'places', function () {
						map.getCanvas().style.cursor = 'pointer';
					});

					// Change it back to a pointer when it leaves.
					map.on('mouseleave', 'places', function () {
						map.getCanvas().style.cursor = '';
					});
	
				});*/
			});
		}
		
	});

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('MainCtrl', function ($scope,jobs,elements,$rootScope,init,location/*,$state,$auth*/) {
		
		console.log('init',init);	
		console.log('init rootScope',$rootScope);	
				
		$scope.search = {
			title : $rootScope.user.location.location ?  $rootScope.user.location.location : init[1].formatted_address
		};
		
		/*
		$scope.getLocaton = function(){
			var self = this;
			console.log('Get Location');
			if($rootScope.user.location){
				console.log('Root Location Found',$rootScope.user.location);
				$scope.search = {
					title : $rootScope.user.location.location
				};
			}else{
				location.getLocation().then(function(result){
					console.log('Get Location Found',result);
					$scope.search = {
						title : result[1].formatted_address
					};
				});
			}
			
		};
		*/
		
		$scope.data = init;
		
		var autocomplete;
		
		console.log('Search',$scope.search);
		
		var home_loc;
		
		$scope.findjobs = function(search){
			console.log('Search',search);
			/*
			jobs.findJobs($scope.search.place_id,$scope.search.job_id).then(function(result){
				console.log('Result',result);
			});
			*/
		}
		
		console.log('rootScope',$rootScope);
		
		$scope.search = $rootScope.user.location;
		
		//google.maps.event.addDomListener(window, 'load',function(){

			angular.element('#job_title').typeahead(null, {
				name: 'job_title',
				display: 'title',
				source: elements.form.bloodhound('/api/job_titles'),
				hint: true,
				highlight: true,
				minLength: 0,
				limit: 10,
				templates: {
					empty: [
						'<div class="tt-suggestion tt-empty-message collection">',
						'No results were found ...',
						'</div>'
					].join('\n'),
					//header: '<div class="collection-header"><h6>'+name+'</h6></div>'
					//suggestion: Handlebars.compile('<div class="collection-item">{{value}}</div>')
				},
				classNames: {
					selectable: 'collection-item',
					dataset : 'collection'
				},
				//identify: function(obj) { return obj.name; },
			}).bind('typeahead:select', function(ev, suggestion) {
				var asset = angular.element(ev.currentTarget).get(0).dataset.asset;
				console.log('Selection(name): ' + suggestion.name);
				console.log('Selection(id): ' + suggestion.id);
				//console.log('event: ' + asset);
				$scope.search.title = suggestion;
				//$scope.currentAsset[asset].name = suggestion.name;

				//$scope.currentAsset
			});
		//});
		
		console.log('Bloodhound',elements.form.bloodhound('/api/job_titles'));
		
		// Create the autocomplete object, restricting the search to geographical
		// location types.
		autocomplete = new google.maps.places.Autocomplete(
			/** @type {!HTMLInputElement} */(angular.element('input#job_location').get(0)),
			{types: ['geocode']});
			
		autocomplete.addListener('place_changed', function(){
			var place = this.getPlace();
			
			console.log('Place',place);
			
			$scope.search = {};
			
			$scope.search.location = place.formatted_address;
			
			$scope.search.place_id = place.place_id;
			
			console.log('Place Search',$scope.search);
			
		});
	});

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('UserCtrl', function ($scope,$rootScope,modal,elements,validation,auth,form) {
		
    	$scope.signIn	=	function(){
			var modalType	=	'small',
				modalTitle	=	'Login',
				modalBody	=	form.login(),
				modalFooter	=	elements.button({	type	:	'submit',	cls:	'btn-primary btn-lg btn-block',	ngClick	:	'login($event)'	},'Login');
				
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				console.log(result);
				
			});
		};
		
		$scope.login	=	function($event){
			//add Spinner
			$event.preventDefault();
			
			console.log($rootScope);
			
			var modalContent	=	angular.element($event.currentTarget).parents()[1],
				form			=	angular.element(modalContent).find('form').serializeArray(),
				formData		=	{
					email		:	form[0].value,
					password	: 	form[1].value
				};
				
				validation.validate(form).then(function(result){
					//remove spinner
					angular.element('.spinner').remove();
					
					if(result.valid){
						
						//console.log('Root',$root);
												
						auth.authenticate(formData).then(function(result){
							console.log('Authentication Result',result);
						});
						
					}else{
						console.log(result);
					}	
					
				});
		};
		
		$scope.closeModal	=	function(){
			angular.element('#modal').modal('hide');
		};
	});

'use strict';

/**
 * @ngdoc function
 * @name jpApp.service:accountData
 * @description
 * # JobsCtrl
 * Service of the jpApp
 */
angular.module('jpApp')
	.service('accountData', function ($q,$http,jobs,$rootScope,location)
	{
		return {
			user		: null,
			getUserData : function(id){
				return $http.get('/api/profile/'+id);
			},
			saveData 	:	function(id,data){
				return $http.post('/api/profile/'+id,data);
			},
			getJobs		:	function(id){
				return $http.get('/api/profile/{'+id+'}/jobs');
			},
			/**
			 * Sets the Users Location in the $rootScope
			 */
			setUserLocation : function(){
				
				var deferred = $q.defer();
				if(!$rootScope.user){
					$rootScope.user = {};
				}
				
				//Get Home location of the current user
				if(navigator.geolocation && !$rootScope.user.location) {
					//console.log('Location Needed');
					
					$rootScope.user.location =	{};
					
					return location.getLocation().then(function(result){
						
						//console.log('Location Result',result);
						
						$rootScope.user.location.location = result[1].formatted_address;
							
						$rootScope.user.location.place_id = result[1].place_id;
						
						$rootScope.user.location.lat 	=	result[1].geometry.location.lat();
						
						$rootScope.user.location.lng	=	result[1].geometry.location.lng();
														
						deferred.resolve(result);
						
						return deferred.promise;
						
					});

				}
			}
		};
	});

'use strict';

/**
 * @ngdoc service
 * @name jpApp.auth
 * @description
 * # auth
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('auth', function ($q,$http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
		return	{
			authenticate	:	function(object){
				var deferred	=	$q.defer();
					
				console.log('Form Object',object);
				
				//console.log($http.post('/api/authenticate'));
				
				$http.post('/api/authenticate',object).then(	function(result){
														console.info('Auth Result',result);
														deferred.resolve(result);
													},
													function(error){
														console.error('Auth Error',error);
														deferred.resolve(error);
													});
				
				return deferred.promise;
			},
			setCookie : function(cname, cvalue, exdays) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				var expires = "expires="+ d.toUTCString();
				document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
			},
			getCookie : function(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				for(var i = 0; i <ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			}
		};
	});

'use strict';

/**
 * @ngdoc service
 * @name jpApp.jobs
 * @description
 * # jobs
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('companies', function ($http,elements) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			/**
			 * Returns a $http.get promise
			 * @param {object} $data - The data for the GET request
			 * @param {integer} $id - The id for the GET request
			 * @returns {Promise}
			 */
			getData	:	function($data,$id){
				console.log($data+' id',$id);
				if($id){
					return $http.get('api/'+$data+'/'+$id);
				}else{
					return	$http.get('api/'+$data);
				}
			},
			/**
			 * Returns a $http.post/put promise
			 * @param {object} $data - The data for the GET request
			 * @param {integer} $id - The id for the GET request
			 * @returns {Promise}
			 */
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				if($id){
					return $http.put('api/'+$name+'/'+$id,$data);
				}else{
					return	$http.post('api/'+$name,$data);
				}
			},
		};
	});

'use strict';

/**
 * @ngdoc factory
 * @name jpApp.elements
 * @description
 * # elements
 * The Elements Factory in the jpApp.
 * This factory is used to generate all basic HTML elements for the UI.
 */
angular.module('jpApp')
  .factory('elements', function () {
	var mockup = [
		{
			icon : 'insert_chart',
			color : 'red'
		},{
			icon : 'formal_quote',
			color : 'yellow darken-1'
		},{
			icon : 'publish',
			color : 'green'
		},{
			icon : 'attach_file',
			color : 'blue'
		}
	], elementsFactory = this;
    return {
		/**
		 * Returns a row HTML element
		 * @param {String} body - The body of the row element
		 * @param {String} cls - additional classes for the row element
		 * @returns {String}
		 */
		row		:	function(body,cls){
			var str = '';
						
			str += '<div class="uk-grid';
			str += cls ? cls : '';
			str += '">';
			str += 		body;
			str += '</div>';
			
			console.log('Elements str',str);
			
			return str;
		},
		/**
		 * Returns a column HTML element
		 * @param {string} num - num of columns 1-12 as per UIKits Grid System
		 * @param {String} body - The body of the column element
		 * @returns {String}
		 */
		column	:	function(num,body,cls){
			var str=	'',
			width = '';
			
			console.log('num',Array.isArray(num),num);
			
			if(Array.isArray(num) && num.length){
				width = num[0]+'-'+num[1];
			}
			
			console.log('column',width);
			
			str	+=	'<div class="uk-width-'+width+' ';
			str +=  cls ? cls : '';
			str +=  '">';
			str	+=		body;
			str	+=	'</div>';

			return str;
		},
		/**
		 * Returns a button HTML element
		 * @param {Object} object - The object holding the button element properties
		 * @param {String} object.cls - The button class
		 * @param {String} object.type - The button type
		 * @param {String} object.ngClick - ngClick event for the button
		 * @param {String} object.label - The button label
		 * @returns {String}
		 */
		button	:	function(object,body){
			var str	=	'';
			
			str	+=	'<button class="uk-button ';
			str +=		object.cls ? object.cls+'"' : '"';
			str	+=		object.type		?	'type="'+object.type+'"'	:	'';
			str	+=		object.ngClick	?	'ng-click="'+object.ngClick+'">'	:	'>';
			str	+=		object.label ? object.label : 'Button Label';
			str	+=	'</button>';
			
			return str;
		},

		/**
		 * Returns the form object for generic form elements
		 * @returns {object}
		 */
		form	:	{
			/**
			 * Returns uikit icons for form elements
			 * @param {String} type - The type of icon based on https://material.io/icons/
			 * @returns {String}
			 */
			glyph	:	function(type){
				var str	=	'';
				
				//str	+=	'<span class="glyphicon glyphicon-'+type+'" aria-hidden="true"></span>';
				str	+=	'<i class=" uk-icon-';
				str	+=	type ? type+'">' : '">';
				str	+=	'</i>';

				return str;
			},
			/**
			 * Returns an input element
			 * @param {object} object - The object holding the input element attributes
			 * @param {Integer} object.colSize - The column size of the input element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the input element
			 * @param {string} object.label - The label for the input field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the input element
			 * @param {String} object.value - The value attribute for the input element
			 * @param {boolean} object.required - The required attribute for the input element. Used for validation
			 * @returns {String}
			 */
			input	:	function(object){
				var	str	=	'',self = this;
				
				str +=	'<div class="input-field ';
				str +=  object.icon ? 'uk-form-icon ' : '';
				str +=  object.colSize ? 'col m'+object.colSize.toString()+' uk-width-1-1">' : 'uk-width-1-1">';
				str +=  object.icon ?  self.glyph(object.icon) : '';
				str	+=	'<input ';
				str	+=	object.type	?	'type="'+object.type+'"' : '';
				str	+=	object.cls  ? 	'class="'+object.cls+'"' : '';
				str	+=	object.label ? ' placeholder="'+object.label+'"' : '';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.value	?	' ng-value="'+object.model+'" '	:	'';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				//str +=  object.typeahead ? 'sf-typeahead options="typeahead" datasets="'+object.typeahead.datasets+'"' : '';
				if(object.typeahead){
					str +=  object.asset ? 'data-asset="'+object.asset+'"' : '';
				}
				str	+=	'>';
				str	+=	'<label ';
				str	+=	object.model	?	' class="active" '	:	'';
				str	+=  'for="'+object.name+'">';
				str	+=	object.label ?  object.label+(object.required ? ' *' : '') : '';
				str +=  '</label>';
				str +=  '</div>';
				/*
				if(object.typeahead){
					var bloodhound = self.bloodhound('/'+object.asset);
					
					console.log('Bloodhound',bloodhound);
					console.log('Name','#'+object.name);
					console.log('Element',angular.element('#'+object.name));
					
					angular.element('#'+object.name).typeahead(null, {
						name: object.name,
						display: 'name',
						source: bloodhound.ttAdapter(),
						hint: true,
						highlight: true,
						minLength: 0,
						templates: {
							empty: [
								'<div class="tt-suggestion tt-empty-message collection">',
								'No results were found ...',
								'</div>'
							].join('\n'),
							//suggestion:'<div class="collection-item">{{value}}</div>'
						},
						classNames: {
							selectable: 'collection-item',
							dataset : 'collection'
						}
					});
				}
				*/
				return str;
			},
			/**
			 * Returns an input group element
			 * @param {icon} object - The icon for the element attributes 
			 * @param {object} object - The object holding the element attributes
			 * @returns {String}
			 */
			inputGroup	:	function(icon,object){
				var str		=	'',
					self	=	this;
		
				str	+=	'<div class="input-field">';
				str	+=		'<i class="material-icons prefix">'+icon+'</i>';
				str	+=		self.input(object);
				str	+=	'</div>';
				
				return str;
			},
			/**
			 * Returns a select element
			 * @param {Integer} object.colSize - The column size of the input element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the input element
			 * @param {string} object.label - The label for the input field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the input element
			 * @param {boolean} object.required - The required attribute for the input element. Used for validation
			 * @returns {String}
			 */
			select	:	function(object){
				var str	=	'';
				
				str +=	'<div class="input-field col m'+object.colSize.toString()+' s12">';
				str +=	'<select ';
				str +=	object.cls ? 'class="'+object.cls+'"' : '';
				str +=	object.model ? 'ng-model="'+object.model+'"' : '';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str +=	'ng-options="g as g.name for g in $root[\''+object.asset+'\'].options.'+object.name+'s track by g.id">';
				//str +=	'<option value="" disabled selected>Choose your option</option>';
				str +=	'</select>';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str +=	'</div>';
				
				return str;
			},
			/**
			 * Returns a textarea element
			 * @param {Integer} object.colSize - The column size of the element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the element
			 * @param {string} object.label - The label for the element
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the element
			 * @param {boolean} object.required - The required attribute for the element. Used for validation
			 * @returns {String}
			 */
			textarea	:	function(object){
				var str	=	'';
				
				str +=	'<div class="input-field col m'+object.colSize.toString()+' s12">';
				str +=	'<textarea class="materialize-textarea';
				str +=	object.cls ? object.cls+'"' : '"';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str +=	object.model ? 'ng-model="'+object.model+'">' : '>';
				str +=	'</textarea>';
				//str +=	object.label ? '<label>'+object.label+'</label>' : '';
				str +=	'</div>';
				
				return str;
			},
			/**
			 * Returns the materialize chips component
			 * @param {object} object - The object holding the chip element properties
			 * @param {string} object.chipType - The chip type based on the materialize
			 * @returns {String}
			 */
			chips	:	function(object){
				var str	=	'';
				
				str	+=	' <div class="chips '+object.chipType+'"></div>';
				return 	str;
			},
			/**
			 * Returns the ui tag it component
			 * @param {object} object - The object holding the chip element properties
			 * @param {string} object.chipType - The chip type based on the materialize
			 * @returns {String}
			 */
			tagit	:	function(object){
				var str	=	'';
				
				str	+=	' <ul id="'+object.name ? object.name : '' +'" class="chips '+object.chipType+'"></ul>';
				
				return 	str;
			},
			/**
			 * Returns the materialize range component
			 * @param {object} object - The object holding the range element properties
			 * @param {string} object.cls - addtional classes for the element
			 * @param {string} object.label - The label for the element
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the element
			 * @param {String} object.min - The maximum range
			 * @param {String} object.max - The minimum range
			 * @param {boolean} object.required - The required attribute for the element. Used for validation
			 * @returns {String}
			 */
			range	:	function(object){
				var str	=	'';
				
				str	+=	'<p class="range-field col m'+object.colSize.toString()+' s12">';
				str	+=		'<label>'+object.label+(object.required ? '*' : '')+' '+( object.model ? ' ( {{ '+object.model+' }} years )' : '' )+'</label>';
				str	+=		'<input type="range"';
				str	+=		object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=		object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=		object.min ? 'min="'+object.min+'"' : '';
				str	+=		object.max ? 'max="'+object.max+'"' : '';
				//str	+=		object.step ? 'step="'+object.step+'"' : '';
				str	+=		object.required ? 'required />' : ' />';
				str	+=	'</p>';
				
				return str;
			},
			/**
			 * Returns a switch element
			 * @param {Integer} object.colSize - The column size of the element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the element
			 * @param {string} object.label1 - The label1 for the element
			 * @param {string} object.label2 - The label2 for the element
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the element
			 * @param {boolean} object.required - The required attribute for the element. Used for validation
			 * @returns {String}
			 */
			check	:	function(object){
				var str	=	'';
				
				str	+=	'<div class="switch col m'+object.colSize.toString()+' s12">';
				str	+=	'	<label>';
				str	+=	object.label1;
				str	+=	'	  <input type="checkbox"';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str	+=	'	  >';
				str	+=	'	  <span class="lever"></span>';
				str	+=	object.label2;
				str	+=	'	</label>';
				str	+=	'</div>';
  
				return str;
			},
			/**
			 * Returns a date element
			 * @param {Integer} object.colSize - The column size of the date element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the date element
			 * @param {string} object.label - The label for the date field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the date element
			 * @param {boolean} object.required - The required attribute for the date element. Used for validation
			 * @returns {String}
			 */
			date	:	function(object){
				var str	=	'';
				
				str +=	'<div class="col s12 m'+object.colSize.toString()+'">';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str	+= ' <input type="date" ';
				str	+= 'class="datepicker';
				str +=	object.cls ? object.cls+'"' : '"';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str	+=	object.required ? 'required />' : ' />';
				str += '</div>';
				
				return str;
			},
			/**
			 * Returns a radio element
			 * @param {Integer} object.colSize - The column size of the date element ( Defaults to 12 )
			 * @param {string} object.cls - addtional classes for the date element
			 * @param {string} object.label - The label for the date field
			 * @param {String} object.model - The 2 way data binding for to the $scope (Angular Js)
			 * @param {String} object.name - The name attribute for the date element
			 * @param {boolean} object.required - The required attribute for the date element. Used for validation
			 * @returns {String}
			 */
			radio	:	function(object){
				var str	=	'';
				
				str +=	'<div class="col s12 m'+object.colSize.toString()+'">';
				str	+= ' <input type="radio" ';
				str	+= 'class="datepicker';
				str +=	object.cls ? object.cls+'"' : '"';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.model	?	' ng-model="'+object.model+'" '	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str	+=	object.required ? 'required />' : ' />';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str += '</div>';
				
				return str;
			},
			/**
			 * Returns the bloodhound twitter typeahead element
			 * @param {string} source - bloodhound prefetch url
			 * @returns {object}
			 */
			bloodhound : function(source){
				var bloodhound = new Bloodhound({
					datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					prefetch: source,
				});
				
				return bloodhound;
			},
			experience : function(){
				var str	=	'',self = this;
								
				str += 	'<div class="uk-grid">';
				//str += 		'<div class="col s12 m4">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Job Title' , name:'job_title' , cls:'typeahead', model : 'exp.job_title' });
				//str += 		'</div>';
				//str += 		'<div class="col s12 m4">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Company' , name:'company' , cls:'typeahead', model : 'exp.company' });
				//str += 		'</div>';
				//str += 		'<div class="col s12 m4">';
				str += 			self.input({ type:'text' ,colSize: 12, cls:'autocomplete', label : 'Location' , name : 'job_location', model : 'exp.location' });
				//str += 		'</div>';
				str += 	'</div>';
				str += 	'<div class="row">';
				str += 		self.textarea({ type:'text' ,colSize: 12, cls:'', label : 'Description' , name : 'description', model : 'exp.description' });
				str += 	'</div>';
				
				return str;
			},
			education : function(){
				var str	=	'',self = this;
								
				str += '<div class="uk-grid">';
				str += 		'<div class="col s12 m6">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'School' , name:'school' , cls:'typeahead', model : 'exp.school' });
				str += 		'</div>';
				str += 		'<div class="col s12 m6">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Degree' , name:'degree' , cls:'typeahead', model : 'exp.degree' });
				str += 		'</div>';
				str += '</div>';
				str += '<div class="uk-grid">';
				str += 		'<div class="col s12 m6">';
				str += 		self.input({ type: 'text' , colSize: 12 , label:'Field' , name:'field' , cls:'typeahead', model : 'exp.field' });
				str += 		'</div>';
				str += 		'<div class="col s12 m6">';
				str += 			self.input({ type: 'text' , colSize: 12 , label:'Location' , name:'location' , cls:'typeahead', model : 'exp.location' });
				str += 		'</div>';
				str += '</div>';
				str += '<div class="uk-grid">';
				str += 		'<div class="col m6 s12">';
				str += 			self.date({	colSize: 12 , label:'Start Date' , name:'start' , cls:'', model : 'exp.dates.start' });
				str += 		'</div>';
				str += 		'<div class="col m6 s12">';
				str += 			self.date({ colSize: 12 , label:'End Date' , name:'end' , cls:'', model : 'exp.dates.end' });
				str += 		'</div>';
				str += '</div>';
				
				
				return str;
			}
		},
		/**
		 * Returns uikit icons
		 * @param {String} type - The type of icon based on https://material.io/icons/
		 * @returns {String}
		 */
		glyph	:	function(type){
			var str	=	'';
			
			//str	+=	'<span class="glyphicon glyphicon-'+type+'" aria-hidden="true"></span>';
			str	+=	'<i class=" uk-icon-';
			str	+=	type ? type+'">' : '">';
			str	+=	'</i>';

			return str;
		},
		
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name jpApp.form
 * @description
 * # form
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('form', function (elements) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return	{
			/**
			 * Returns the login form
			 * @returns {String}
			 */
			login	:	function(){
				var	str	=	'';
				
				str		+=	'<div class="uk-text-center">'

				str	+=	'	<img class="uk-margin-bottom" width="140" height="120" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkViZW5lXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTQwcHgiIGhlaWdodD0iMTIwcHgiIHZpZXdCb3g9Ii0yOS41IDI3NS41IDE0MCAxMjAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTI5LjUgMjc1LjUgMTQwIDEyMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8ZyBvcGFjaXR5PSIwLjciPg0KCTxwYXRoIGZpbGw9IiNEOEQ4RDgiIGQ9Ik0tNi4zMzMsMjk4LjY1NHY3My42OTFoOTMuNjY3di03My42OTFILTYuMzMzeiBNNzkuNzg4LDM2NC4zNTVIMS42NTZ2LTU3LjcwOWg3OC4xMzJWMzY0LjM1NXoiLz4NCgk8cG9seWdvbiBmaWxsPSIjRDhEOEQ4IiBwb2ludHM9IjUuODYsMzU4LjE0MSAyMS45NjIsMzQxLjIxNiAyNy45OTUsMzQzLjgyNyA0Ny4wMzIsMzIzLjU2MSA1NC41MjQsMzMyLjUyMyA1Ny45MDUsMzMwLjQ4IA0KCQk3Ni4yMDMsMzU4LjE0MSAJIi8+DQoJPGNpcmNsZSBmaWxsPSIjRDhEOEQ4IiBjeD0iMjQuNDYyIiBjeT0iMzIxLjMyMSIgcj0iNy4wMzQiLz4NCjwvZz4NCjwvc3ZnPg0K" alt="">';

				str	+=	'	<form class="uk-panel uk-panel-box uk-form">';
				str	+=	'		<div class="uk-form-row">';
				str	+=				elements.form.input({ 	
														type		:	'email',	
														cls			:	'uk-form-large uk-width-1-1 validate'	,	
														placeholder	:	'Email'	,	
														model		:	'email',
														name		:	'email',
														required	:	true ,
														icon 		:	'user'
													});
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row">';
				str	+=				elements.form.input({ 	
														type		:	'password',	
														cls			:	'uk-form-large uk-width-1-1 validate'	,	
														placeholder	:	'Email'	,	
														model		:	'password',
														name		:	'password',
														required	:	true ,
														icon 		:	'lock'
													});
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row">';
				str	+=	'			<a class="uk-width-1-1 uk-button uk-button-primary uk-button-large" ng-click="login($event)">Login</a>';
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row">';
				str	+=	'			<a class="uk-width-1-1 uk-button uk-button-default uk-button-large" ng-click="authenticate(\'linkedin\')">Login with <i class="uk-icon-linkedin-square"></i></a>';
				str	+=	'		</div>';
				str	+=	'		<div class="uk-form-row uk-text-small">';
				str	+=	'			<label class="uk-float-left"><input type="checkbox"> Remember Me</label>';
				str	+=	'			<a class="uk-float-right uk-link uk-link-muted" href="#">Forgot Password?</a>';
				str	+=	'		</div>';
				str	+=	'	</form>';

				str	+=	'</div>';
				
				return str;
			},
			/**
			 * Returns the Registration form
			 * @returns {String}
			 */
			register	:	function(){
				var str	=	'';
				
				return str;
			},
			/**
			 * Returns the form to edit a job
			 * @returns {String}
			 */
			editJob		:	function(id){
				
				//console.log('Job id',id);
				
				var str	=	'';
				
					str	+=	'<form>';
					
					str	+=		elements.row(
									elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.title' , label : 'Job Title' , name : 'job_title' , required:true })+
									elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Type e.g Full time , Part time..', name : 'job_types' , model:'currentAsset.job_type.name' , required:true , asset :'job_type',typeahead : { datasets:'jobTypes'}})+
									elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Level e.g Entry , Junior, Intermediate..' , name : 'job_levels' , model:'currentAsset.job_level.name' , required:true , asset :'job_level',typeahead : { datasets:'jobLevels'}})+
									elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Category' , name : 'job_categories' , model:'currentAsset.job_category.name' , required:true , asset :'job_category',typeahead : { datasets:'jobCategories'}})
								);
								
					str	+=		elements.row(elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.location.name' , label : 'Job Location' , name : 'job_location' , required:true })+
											elements.form.input({ type:'text', colSize: 6, cls:'typeahead' , label : 'Minimum Qualification' , name : 'min_qualifications' , model:'currentAsset.min_qualification' , required:true , asset :'min_qualification',typeahead : { datasets:'minQualification'}})
											);
											
					str	+=		elements.row(elements.form.range({ colSize: 12, cls:'', model:'currentAsset.min_experience' , label : 'Minimum Experience' , name : 'job_min_experience' , min:0,max:15 }));
					
					str	+=		elements.row('<div class="range-field col m12 s12">'+
												'<label>Salary <span class="min"></span> - <span class="max"></span> {{ currentAsset.salary_type.name }}</label>'+
												'<div id="pay"></div>'+
											'</div>');
					
					str	+=		elements.row(elements.form.input({ type:'text', colSize: 12, cls:'typeahead' , label : 'Salary Type' , name : 'salary_types' , model:'currentAsset.salary_type.name' , required:true , asset :'salary_type',typeahead : { datasets:'salaryTypes'}}));
					
					str	+=		elements.row(elements.form.textarea({ colSize: 12, cls:'' , label : 'Job Description' , name : 'job_description' , model:'currentAsset.description' , required:true}));
					
					str	+=		elements.row('<div class="range-field col m12 s12">'+
												'<label>Required Skills</label>'+
					//str	+=				elements.form.chips({ colSize: 12, cls:'hidden' , label : 'Required Skills' , name : 'required_skills' , model:'currentAsset.required_skills',chipType : 'chips-autocomplete'})+
												elements.form.tagit({ colSize: 12, cls:'' , label : 'Required Skills' , name : 'required_skills' , model:'currentAsset.required_skills'})+
											'</div>');
									
					str	+=			elements.row(elements.form.date({ colSize: 12, cls:'' , label : 'Application Deadline' , name : 'application_deadline' , model:'currentAsset.application_deadline', required:true }));
					str	+=	'</form>';
					
				return str;
			},
			/**
			 * Returns the edit company form
			 * @returns {string}
			 */
			editCompany		:	function(){
				var str	=	'';
				
					str	+=	'<form>';
					//str +=		elements.uk-grid(elements.toolbar('ng-click="action()"'));
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'autocomplete', model:'currentAsset.name' , label : 'Company Name' , name : 'company_name' , required:true });
					str	+=			elements.form.input({ type:'text', colSize: 4, cls:'typeahead' , label : 'Company Type e.g Software , Construction ', name : 'company_cat' , model:'currentAsset.company_category[0].name' , required:true , asset :'company_category',typeahead : { datasets:'companyCats'}});
					//str	+=			elements.form.select({ colSize: 4, cls:'' , label : 'Company Category' , name : 'company_cat' , model:'currentAsset.company_category' , required:true ,asset:'company'});
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'autocomplete', model:'currentAsset.location.name' , label : 'Company Location' , name : 'company_location' , required:true });
					str	+=		'</div>';
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.input({ type:'text' ,colSize: 8, cls:'', model:'currentAsset.address' , label : 'Company Address' , name : 'company_address' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentAsset.zipcode' , label : 'Zipcode' , name : 'zipcode' , required:false });
					str +=		'</div>';
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Company Description' , name : 'company_description' , model:'currentAsset.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="uk-grid">';
					str	+=			elements.form.input({ type:'email' ,colSize: 4, cls:'', model:'currentAsset.email' , label : 'Email Address' , name : 'email' , required:false });
					str	+=			elements.form.input({ type:'tel' ,colSize: 4, cls:'', model:'currentAsset.phone' , label : 'Phone Number' , name : 'phone' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentAsset.logo' , label : 'Company Logo' , name : 'logo' });
					str	+=		'</div>';
					str	+=	'</form>';
					
				return str;
			},
			/**
			 * Returns the edit user profile form
			 * @returns {string}
			 */
			editProfile	:	function(){
				var str	=	'';
				
				str += '<div class="col m12">';
				str += '<div class="uk-grid">';
				str += 		'<h4 class="left">Experience</h4>';
				str += 		'<button ng-click="addExperience()" class="right btn-floating btn-small">'+elements.glyph('add','large')+'</button>';
				str += '</div>';
				str += '<div class="uk-grid card" ng-repeat="exp in currentAsset.experience">';
				str += 		'<div class="uk-grid">';
				str += 			'<button class="right btn-floating btn-small" ng-click="removeExperience($index)">'+elements.glyph('delete','large')+'</button>';
				str += 		'</div>';
				str += 		'<div class="card-content">';
				str += 			elements.form.experience();
				str += 		'</div>';
				str += '</div>';
				str += '</div>';
				str += '<div class="col m12">';
				str += '<div class="uk-grid">';
				str += 		'<h4 class="left">Education</h4>';
				str += 		'<button ng-click="addEducation()" class="right btn-floating">'+elements.glyph('add','large')+'</button>';
				str += '</div>';
				str += '<div class="uk-grid card" ng-repeat="exp in currentAsset.education">';
				str += 		'<div class="uk-grid">';
				str += 			'<button class="right btn-floating btn-small" ng-click="removeEducation($index)">'+elements.glyph('delete','large')+'</button>';
				str += 		'</div>';
				str += 		'<div class="card-content">';
				str += 			elements.form.education();
				str += 		'</div>';
				str += '</div>';
				str += '</div>';
				
				return str;
			},
		};
	});

'use strict';

/**
 * @ngdoc service
 * @name jpApp.jobs
 * @description
 * # jobs
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('jobs', function ($http,elements,$rootScope,$auth) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			/**
			 * Returns a $http.get promise to get a job based on the job id
			 * @param {object} $data - The data for the GET request
			 * @param {integer} $id - The id for the GET request
			 * @returns {Promise}
			 */
			getData	:	function($data,$id,$params){	
				var logged_in = $auth.isAuthenticated();
								
				return	$http.get('api/'+$data+($id ? '/'+$id : '')+(logged_in ? '?token='+$auth.getToken() : ''));
			},
			/**
			 * Returns a $http.put or post promise to store a job based on job id and its data
			 * @param {String} $name - The name of the PUT/POST endpoint
			 * @param {object} $data - The data for the PUT/POST request
			 * @param {integer} $id - The id for the PUT/POST enpoint
			 * @returns {Promise}
			 */
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				return	$http.post('api/'+$name+($id ? '/'+$id : ''),$data);
			},
			/**
			 * Returns a $http.put or post promise to store a job based on job id and its data
			 * @param {String} $name - The name of the PUT/POST endpoint
			 * @param {object} $data - The data for the PUT/POST request
			 * @param {integer} $id - The id for the PUT/POST enpoint
			 * @returns {Promise}
			 */
			findJobs : function(location_id,job_id){
				return $http.get('api/locations/'+location_id+'/jobs/'+job_id);
			}
		};
	});

'use strict';

/**
 * @ngdoc service
 * @name jpApp.location
 * @description
 * # location
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('location', function ($q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			/**
			 * Returns the current location of the user
			 * @returns {Promise}
			 */
			getLocation	:	function(){
				var deferred = $q.defer(),
					self = this;
				
				navigator.geolocation.getCurrentPosition(function(pos){
					console.log('App Pos',pos);
					//$rootScope.user.location.geo = {lat: , lng: };
					self.geoCoder(pos.coords.latitude,pos.coords.longitude).then(function(result){
						deferred.resolve(result)
					}).catch(function(error){
						//To Do Logging Service 
						console.error(error);
						deferred.reject(error);
					});
				});
				
				return deferred.promise;
			},
			/**
			 * Returns a location based on longitude and latitude
			 * @param {int} lat - Latitude
			 * @param {int} lng - Longitude
			 * @returns {Promise}
			 */
			geoCoder : function(lat,lng){
				var geo = new google.maps.Geocoder,
					deferred = $q.defer();
		
				geo.geocode({'location': {lat: lat, lng: lng}}, function(result, status) {
					//console.log('Geo Coder Result',result,status);
					if(result.length >= 1){
						deferred.resolve(result);
					}else{
						deferred.reject(result);
					}
				});
				
				return deferred.promise;
			}
			
		};
	});

'use strict';

/**
 * @ngdoc service
 * @name jpApp.modalService
 * @description
 * # modalService
 * Service in the jpApp.
 */
angular.module('jpApp')
  .service('modal', function ($q,$compile,$window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	return	{
		modal	:	function(type,title,body,footer,$scope){
			
			$scope.modal = {};
						
			var str	=	'',
				deferred	=	$q.defer();
			
			str	+=	'<div id="modal" class="uk-modal '+type+'">';
			str += 		'<div class="uk-modal-dialog">';
			str +=  		'<div class="uk-modal-spinner uk-hidden"></div>';
			str	+=			title ? '<div class="uk-modal-header">'+title+'</div>' : '';
			str	+=				'<div class="uk-alert uk-hidden">';
			str	+=				'<a href="" class="uk-alert-close uk-close"></a>';
			str	+=				'<p></p>';
			str +=				'</div>';
			str	+=				body;
			str	+=			footer ? '<div class="uk-modal-footer">'+footer+'</div>' : '';
			str	+=		'</div>';
			str	+=	'</div>';
			
			angular.element('body').append($compile(str)($scope));
			
			console.log('Modal $window',$window);
			
			$window.UIkit.modal('#modal').show().on({
				'hide.uk.modal': function(){
					angular.element('#modal').remove();
				}
			});
			
			
			return deferred.promise;
			
			deferred.resolve(str);
		}
	};
});

'use strict';

/**
 * @ngdoc service
 * @name jpApp.validation
 * @description
 * # validation
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('validation', function ($q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			validate	:	function(form){
				var deferred		=	$q.defer(),
					validated		=	[],
					formElement		=	angular.element(form),
					validatedCount	=	0,
					elemCount		=	formElement.find('input').length;
						
			formElement.find('input').each(function(){
							var element = angular.element(this);
								
							if(element[0].dataset.required){
								if(element.val()){
									
									//add success class
									element.parent().removeClass('has-success')
													.removeClass('has-error')
													.addClass('has-success');
									
									validated.push({
										name		:	element[0].name,
										value		:	element.val(),
										validated	:	true
									});
									
									validatedCount++;
								}else{
									//add error validation class to form element
									element.parent().removeClass('has-success')
													.removeClass('has-error')
													.addClass('has-error');
									
									validated.push({
										name		:	element[0].name,
										value		:	element.val(),
										validated	:	false
									});
								}
							}else{
								//add success class
								element.parent().removeClass('has-error').addClass('has-success');
								
								validated.push({
									name		:	element[0].name,
									value		:	element.val(),
									validated	:	true
								});
							}
								
						});
				
				console.log('Form Object',validatedCount,elemCount);
				
				if(validatedCount	===	elemCount){
					deferred.resolve({	valid	:	true	,	form	:	form	});
				}else{
					deferred.resolve({	valid	:	false	,	form	:	form	});
				}
					
				
				
				
				return deferred.promise;
			}
		};
	});

//# sourceMappingURL=all.js.map
