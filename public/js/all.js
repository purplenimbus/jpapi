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
		'xeditable'
	])
	.config(function ($routeProvider,$locationProvider) {
		console.log('Route Provider',$routeProvider);

		$routeProvider
			.when('/',{
				templateUrl	:	'/views/main.html',
				controller	:	'MainCtrl',
				controllerAs	:	'main'
			})
			.when('/jobs',{
				templateUrl	:	'/views/jobs.html',
				controller	:	'JobsCtrl',
				controllerAs: 	'jobs'
			})
			.when('/jobs/:jobId',{
				templateUrl	:	'/views/partials/jobs/view-job.html',
				controller	:	'JobCtrl',
				controllerAs: 	'job'
			})
			.when('/companies',{
				templateUrl	:	'/views/companies.html',
				controller	:	'CompaniesCtrl',
				controllerAs: 	'Companies'
			})
			.when('/companies/:companyId',{
				templateUrl	:	'/views/partials/companies/view-company.html',
				controller	:	'CompanyCtrl',
				controllerAs: 	'Company'
			})
			.otherwise({
				templateUrl : 	'Not Found'
			});

		//$locationProvider.html5Mode(true);
	}).run(function(editableOptions,editableThemes) {
		editableThemes.bs3.inputClass = 'input-sm';
		editableThemes.bs3.buttonsClass = 'btn-sm';
		editableOptions.theme = 'bs3';
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
	.controller('AuthCtrl', function (/*$auth,$state,*/$rootScope,$scope,validation,form,elements,modal,jobs,companies,$location,$route,auth) {
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		$rootScope.logged_in = false;
		
		angular.element(".dropdown-button").dropdown();
        angular.element(".account-collapse").sideNav();
		
		if(!$rootScope.job){
			$rootScope.job = {};
			$rootScope.$location = {};
		
			$rootScope.$location.base = $location.path().split('\/')[1];
		}
		
		if(!$rootScope.company){
			$rootScope.company = {};
			
			$rootScope.$location = {};
		
			$rootScope.$location.base = $location.path().split('\/')[1];
		}
		
		
		//var vm = this;
		
        $scope.login = function($event) {
			
			$event.preventDefault();

			console.log($rootScope);
			
			var modalContent	=	angular.element($event.currentTarget).parents()[1],
				form			=	angular.element(modalContent).find('form').serializeArray();
				/*
				credentials		=	{
					email		:	form[0].value,
					password	: 	form[1].value
				};
				*/
				
			validation.validate(form).then(function(result){
				//remove spinner
				angular.element('.spinner').remove();
				
				if(result.valid){											
					/* Use Satellizer's $auth service to login
					$auth.login(credentials).then(function(data) {
						console.log('Data',data);
						// If login is successful, redirect to the users state
						//$state.go('users', {});
					});
					*/
				}else{
					console.log(result);
				}	
				
			});
			
            
        };
		
		$scope.signIn	=	function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'<h4 class="left">Login</h4>',
				modalBody	=	form.login(),
				modalFooter	=	'';//elements.button({	type	:	'submit',	cls:	'btn teal accent-3',	ngClick	:	'login($event)'	},'Login');
				
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				console.log(result);
				
			});
		};
		
		$scope.view_account = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'Login',
				modalBody	=	$rootScope.logged_in ? 'View account' : form.login(),
				modalFooter	=	elements.button({	type	:	'submit',	cls:	'btn teal accent-3',	ngClick	:	'login($event)'	},'Login');
				
				modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
					console.log(result);
					
				});
		};
		
		$scope.closeModal	=	function(){
			angular.element('#modal').modal('hide').remove();
		};
		
		/*
		if(!$rootScope.job.options){
			jobs.getData('joboptions',false).then(function(result){
				console.log('Got a job options',result);
				$rootScope.job.options = result.data;
				$rootScope.job.options.job_status = [{
					id 		: 	1,
					name	:	'Draft',	
				},{
					id 		: 	2,
					name	:	'Published',	
				}];
				var job_cookie = JSON.stringify($rootScope.job.options);
				console.log('Job Cookie',job_cookie);
				auth.setCookie('job_options',job_cookie,1);
			});
		}else{
			console.log('Job Options',auth.getCookie('job_options'));
		}
		
		if(!$rootScope.company.options){		
			companies.getData('companyoptions',false).then(function(result){
				console.log('Got company options',result);
				$rootScope.company.options = result.data;
				$rootScope.company.options.company_status = [{
					id 		: 	1,
					name	:	'Draft',	
				},{
					id 		: 	2,
					name	:	'Published',	
				}];
				var company_cookie = JSON.stringify($rootScope.job.options);
				console.log('Company Cookie',company_cookie);
				auth.setCookie('company_options',company_cookie,1);
			});
		}else{
			console.log('Company Options',auth.getCookie('company_options'));
		}
		*/
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
				Materialize.toast('Got some companies '+result.data.length, 3000);
				$scope.companies = result.data;
				str	=	'<li class="col m12" ng-repeat="company in companies" ng-include="\'views/partials/companies/company.html\'"></li>';
				angular.element('ul.companies').append($compile(str)($scope));
				angular.element('.progress').hide();
			});
		};
		
		$scope.init();
		
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
	.controller('CompanyCtrl', function ($scope,companies,jobs,$route,$location,$filter,modal,elements,$rootScope,form)
	{
		
		$rootScope.$location.title = '';
		
		angular.element('.progress').show();
		
		var autocomplete,self = this;
		
		this.data = {};
		
		console.log($route);
		
		$scope.init = function(){
			companies.getData('companies',$route.current.params.companyId).then(function(result){
				$scope.currentAsset = result.data;
				//$scope.currentAsset.application_deadline = result.data.application_deadline ? new Date(result.data.application_deadline) : result.data.application_deadline;
				$scope.cache = $scope.currentAsset;
				console.log('Got a Company',$scope.currentAsset);
				$rootScope.$location.title = $scope.currentAsset.title;
				angular.element('.progress').hide();
			});
		};
		
		if(!$scope.currentAsset){
			$scope.init();
		}
		
		$scope.companyOptions = function(options) {
			switch(options){
				case 'company_status' :  return function(){
					var selected = $filter('filter')($rootScope.company.options.company_status, {value: $scope.currentAsset.status});
					return ($scope.currentAsset.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.updateCompany = function(){			
			
			this.data	=	{
				id : $scope.currentAsset.id,
				name : $scope.currentAsset.name,
				description : $scope.currentAsset.description,
				company_category_id : $scope.currentAsset.company_category.id,
				email : $scope.currentAsset.email,
				address : $scope.currentAsset.address,
				zipcode	: $scope.currentAsset.zipcode,
				phone : $scope.currentAsset.phone,
				logo : $scope.currentAsset.logo,
				status : $scope.currentAsset.status
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
			$scope.init();
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
					$scope.currentAsset.description = evt.editor.getData();
				});
				
				/*
				angular.element('.chips-initial').on('chip.add', function(e, chip){
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).material_chip({
					placeholder: 'Skills',
					data: $scope.currentAsset.required_skills
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
					
					$scope.currentAsset.location.name = place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						//console.log('Value',value);
						$scope.currentAsset.location[value.types[0]] = {};
						$scope.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						$scope.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
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
						$scope.currentAsset[asset] = suggestion;
						//$scope.currentAsset[asset].name = suggestion.name;
						
						console.log('Scope asset(id): ' + $scope.currentAsset[asset].id);
						console.log('Scope asset(name): ' + $scope.currentAsset[asset].name);
						//$scope.currentAsset
					});
				});
			});
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
	.controller('JobCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope,form)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		$rootScope.$location.title = '';
		
		angular.element('.progress').show();
		
		var autocomplete,self = this;
		
		this.data = {};
		
		console.log($route);
		
		$scope.init = function(){
			jobs.getData('jobs',$route.current.params.jobId).then(function(result){
				$scope.currentAsset = result.data;
				//$scope.currentAsset.application_deadline = result.data.application_deadline ? new Date(result.data.application_deadline) : result.data.application_deadline;
				console.log('Date',result.data.application_deadline);
				$scope.cache = $scope.currentAsset;
				$scope.currentAsset.pay = {};
				console.log('Got a job',$scope.currentAsset);
				$scope.currentAsset.application_deadline ? 
					$scope.currentAsset.application_deadline = new Date($scope.currentAsset.application_deadline)
					: null;
				$rootScope.$location.title = $scope.currentAsset.title;
				angular.element('.progress').hide();
			});
		};
		
		if(!$scope.currentAsset){
			$scope.init();
		}
		
		$scope.jobOptions = function(options) {
			switch(options){
				case 'job_status' :  return function(){
					var selected = $filter('filter')($rootScope.job.options.job_status, {value: $scope.currentAsset.status});
					return ($scope.currentAsset.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.updateJob = function(){			
			
			console.log('Scope Data',$scope.currentAsset);
			
			this.data	=	{
				id : $scope.currentAsset.id,
				title : $scope.currentAsset.title,
				description : $scope.currentAsset.description,
				company_id : $scope.currentAsset.company.id,
				job_category_id : $scope.currentAsset.job_category.id,
				job_type_id : $scope.currentAsset.job_type.id,
				job_level_id : $scope.currentAsset.job_level.id,
				//job_salary_id : $scope.currentAsset.salary_type.id,
				application_deadline : $scope.currentAsset.application_deadline,
				salary : $scope.currentAsset.salary,
				status : $scope.currentAsset.status,
				min_experience : $scope.currentAsset.min_experience,
				min_qualification : $scope.currentAsset.min_qualification.name,
			}
			
			if($scope.currentAsset.location){
				this.data.location = {
					name : $scope.currentAsset.location.name,
					locality : $scope.currentAsset.location.neighborhood ? $scope.currentAsset.location.neighborhood.long_name : $scope.currentAsset.location.vicinity,
					city	:	$scope.currentAsset.location.locality.long_name,
					city_code	:	$scope.currentAsset.location.locality.long_name,
					state	:	$scope.currentAsset.location.administrative_area_level_1.long_name ? $scope.currentAsset.location.administrative_area_level_1.long_name : '',
					state_code	:	$scope.currentAsset.location.administrative_area_level_1.short_name ? $scope.currentAsset.location.administrative_area_level_1.short_name : '',
					country	:	$scope.currentAsset.location.country.long_name ? $scope.currentAsset.location.country.long_name : '',
					country_code	: $scope.currentAsset.location.country.short_name ? $scope.currentAsset.location.country.short_name : '',
					lng	:	$scope.currentAsset.location.geo.lng,
					lat	:	$scope.currentAsset.location.geo.lat,
					ref_id	:	$scope.currentAsset.location.place_id,
					url	:	$scope.currentAsset.location.geo.url,
					zip_code : $scope.currentAsset.location.zipcode ? $scope.currentAsset.location.zipcode : ''
				}
			}
			
			console.log('Data',this.data);
			
			jobs.sendData('jobs',$route.current.params.jobId,this.data).then(function(result){
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
			$scope.init();
		}
		
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Job</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'status' , model:'currentAsset.status',colSize: 12,label1:'draft',label2:'published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'cancel()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateJob()'	, label : 'Save'});
			
			modalBody	=	form.editJob();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'job_description' ).on( 'change', function( evt ) {
					$scope.currentAsset.description = evt.editor.getData();
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
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					$scope.currentAsset.required_skills = angular.element(this).material_chip('data');
				});
					
				console.log(elements.form.bloodhound('/job_skills').index.datums);
				
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
					
					$scope.currentAsset.location = {};
					
					$scope.currentAsset.location.name = place.formatted_address;//place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						console.log('Value',value);
						$scope.currentAsset.location[value.types[0]] = {};
						$scope.currentAsset.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						$scope.currentAsset.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
					$scope.currentAsset.location.place_id = place.place_id ? place.place_id : '';
					$scope.currentAsset.location.vicinity = place.vicinity ? place.vicinity : '';
						
					//Set location long lat
					$scope.currentAsset.location.geo = { 
															lng : place.geometry.location.lng(), 
															lat	: place.geometry.location.lat(),
															url : place.url
														};
					//Set url
					console.log('Location Asset',$scope.currentAsset.location);
				});
				
				var slider = angular.element('#pay').get(0);
				//console.log('Salary',parseInt($scope.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')));				
				//console.log('Salary Scope',$scope);				
				
				noUiSlider.create(slider, {
					start: $scope.currentAsset.salary ? [parseInt($scope.currentAsset.salary.split(',')[0].toString().replace(/$$|.000/g,'')), 
							parseInt($scope.currentAsset.salary.split(',')[1].toString().replace(/$$|.000/g,''))] : [0,100],
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
						postfix: '.000',
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					console.log('Slider Changed',value.toString());
					$scope.currentAsset.pay.value  = value;
					$scope.currentAsset.salary  = value.toString();
					$scope.currentAsset.pay.min = value[0];
					angular.element('.range-field span.min').html(value[0]);
					$scope.currentAsset.pay.max  = value[1];
					angular.element('.range-field span.max').html(value[1]);
				});
				
				
				angular.element('.datepicker').pickadate({
					selectMonths: true, // Creates a dropdown to control month
				}).on('change',function(e){
					$scope.currentAsset.application_deadline = new Date(angular.element(e.currentTarget).val());
				});
				
				//Initalize Typeahead
				angular.element('.typeahead').each(function(key,value){
					
					var name = angular.element(value).get(0).name;
										
					angular.element('#'+name).typeahead(null, {
						name: name,
						display: 'name',
						source: elements.form.bloodhound('/'+name).ttAdapter(),
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
						$scope.currentAsset[asset] = suggestion;
						//$scope.currentAsset[asset].name = suggestion.name;
						
						console.log('Scope asset(id): ' + $scope.currentAsset[asset].id);
						console.log('Scope asset(name): ' + $scope.currentAsset[asset].name);
						//$scope.currentAsset
					});
				});
				
				console.log('Check current asset',$scope.currentAsset.status === 1);
				
				$scope.currentAsset.status === 1 ? angular.element('#status').get(0).checked = true : null;
				
			});
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
				str	+=	'<a href="#jobs/{{ job.id }}" class="collection-item" ng-repeat="job in jobs">';
				str +=		'{{ job.title }} <span class="grey-text text-lighten-1">{{ job.job_type.name }}</span>';
				str +=			'<div class="right text-right hide">';
				str	+=			'<span>{{ job.company.name }} , {{ job.location.name }}</span>';
				str +=			'</div>';
				str +=		'</div>';
				str	+=	'</a>';
				angular.element('div.jobs').append($compile(str)($scope));
				angular.element('.progress').hide();
			});
		};
		
		$scope.init();
		
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
	.controller('MainCtrl', function () {
		angular.element('.loading').hide();
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
														console.log(result);
														deferred.resolve(result);
													},
													function(error){
														console.log(error);
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
					return $http.get($data+'/'+$id);
				}else{
					return	$http.get($data);
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
					return $http.put($name+'/'+$id,$data);
				}else{
					return	$http.post($name,$data);
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
	], self = this;
    return {
		/**
		 * Returns a row HTML element
		 * @param {String} body - The body of the row element
		 * @param {String} cls - additional classes for the row element
		 * @returns {String}
		 */
		row		:	function(body,cls){
			var str = '';
			
			str += '<div class="row';
			str += cls ? cls : '';
			str += '">';
			str += 		body;
			str += '</div>';
			
			return str;
		},
		/**
		 * Returns a column HTML element
		 * @param {Integer} str - num of columns 1-12
		 * @param {String} body - The body of the column element
		 * @returns {String}
		 */
		column	:	function(num,body){
			var str=	'';
			if( typeof num ===	'number'){
				str	+=	'<div class="col m'+num+'">';
				str	+=		body;
				str	+=	'</div>';
				
				return str;
			}else{
				str	+=	'<div class="col m'+num[0]+' s'+num[1]+'">';
				str	+=		body;
				str	+=	'</div>';
				
				return str;
			}
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
			
			str	+=	'<button class="btn ';
			str +=		object.cls ? object.cls+'"' : '"';
			str	+=		object.type		?	'type="'+object.type+'"'	:	'';
			str	+=		object.ngClick	?	'ng-click="'+object.ngClick+'">'	:	'>';
			str	+=		object.label ? object.label : 'Button Label';
			str	+=	'</button>';
			
			return str;
		},
		/**
		 * Returns a materalize button toolbar
		 * @param {string} action - The action associated the primary button
		 * @param {string} icon - The icon for the secondary button
		 * @param {array} array - The array holding the secondary buttons objects
		 * @param {String} array.value.color - The secondary button color based on materialize
		 * @param {String} array.value.action - The secondary action
		 * @param {String} array.value.icon - The secondary button icon
		 * @returns {String}
		 */
		toolbar : function(action,type,icon,array){
			var str = '';
			
			str += '<div class="fixed-action-btn '+(type ? 'horizontal' : '')+' click-to-toggle">';
			str += '	<a class="btn-floating btn-large red" '+action+'>';
			str += '	  <i class="material-icons">'+(icon ? icon : 'menu')+'</i>';
			str += '	</a>';
			if(array){ 
			str += '<ul>';
				angular.forEach(array,function(value,key){
					str += value ? '<li><a class="btn-floating '+(value.color ? value.color : 'red')+'" '+(value.action ? value.action : '')+'><i class="material-icons">'+(value.icon ? value.icon : 'insert_chart')+'</i></a></li>' : '';
				});
			str += '</ul>';
			}
			str += '</div>';;
		},
		/**
		 * Returns the form object for generic form elements
		 * @returns {object}
		 */
		form	:	{
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
				str +=  object.colSize ? 'col m'+object.colSize.toString()+' s12">' : 'col s12">';
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
			}
		},
		/**
		 * Returns materalize icons
		 * @param {String} type - The type of icon based on https://material.io/icons/
		 * @returns {String}
		 */
		glyph	:	function(type){
			var str	=	'';
			
			str	+=	'<span class="glyphicon glyphicon-'+type+'" aria-hidden="true"></span>';

			return str;
		}
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
				
				str	+=	'<form>';
				str	+=	'<div class="row form-group">';
				str	+=	elements.column(12,elements.form.inputGroup('info_outline',{ 	
														type		:	'email',	
														cls			:	'input-lg'	,	
														placeholder	:	'Email'	,	
														model		:	'',
														name		:	'email',
														required	:	true
													}));
				str	+=	'</div>';
				str	+=	'<div class="row form-group">';
				str	+=	elements.column(12,elements.form.inputGroup('lock',{ 	
														type		:	'password',	
														cls			:	'input-lg'	,	
														placeholder	:	'Password'	,	
														model		:	'',
														name		:	'password',
														required	:	true
													}));
				str	+=	'</div>';
				str	+=	'<div class="row form-group">';
				str	+=	elements.column(12,elements.button({ ngClick : 'login',label:'login' , cls : 'btn-large col s12' }));
				str	+=	'</div>';
				str	+=	'</form>';
				
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
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.title' , label : 'Job Title' , name : 'job_title' , required:true });
					str	+=			elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Type e.g Full time , Part time..', name : 'job_types' , model:'currentAsset.job_type.name' , required:true , asset :'job_type',typeahead : { datasets:'jobTypes'}});
					str	+=			elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Level e.g Entry , Junior, Intermediate..' , name : 'job_levels' , model:'currentAsset.job_level.name' , required:true , asset :'job_level',typeahead : { datasets:'jobLevels'}});
					str	+=			elements.form.input({ type:'text', colSize: 2, cls:'typeahead' , label : 'Job Category' , name : 'job_categories' , model:'currentAsset.job_category.name' , required:true , asset :'job_category',typeahead : { datasets:'jobCategories'}});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.location.name' , label : 'Job Location' , name : 'job_location' , required:true });
					str	+=			elements.form.input({ type:'text', colSize: 6, cls:'typeahead' , label : 'Minimum Qualification' , name : 'min_qualifications' , model:'currentAsset.min_qualification' , required:true , asset :'min_qualification',typeahead : { datasets:'minQualification'}});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.range({ colSize: 12, cls:'', model:'currentAsset.min_experience' , label : 'Minimum Experience' , name : 'job_min_experience' , min:0,max:15 });
					str	+=		'</div>';			
					str	+=		'<div class="row">';
					str	+=			'<div class="range-field col m12 s12">';
					str	+=				'<label>Salary <span class="min"></span> - <span class="max"></span> {{ currentAsset.salary_type.name }}</label>';
					str	+=				'<div id="pay"></div>';
					str	+=			'</div>';
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text', colSize: 12, cls:'typeahead' , label : 'Salary Type' , name : 'salary_types' , model:'currentAsset.salary_type.name' , required:true , asset :'salary_type',typeahead : { datasets:'salaryTypes'}});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Job Description' , name : 'job_description' , model:'currentAsset.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			'<div class="range-field col m12 s12">';
					str	+=			'<label>Required Skills</label>';
					str	+=			elements.form.chips({ colSize: 12, cls:'' , label : 'Required Skills' , name : 'required_skills' , model:'currentAsset.required_skills',chipType : 'chips-autocomplete'});
					str	+=			'</div>';
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.date({ colSize: 12, cls:'' , label : 'Application Deadline' , name : 'application_deadline' , model:'currentAsset.application_deadline', required:true });
					str	+=		'</div>';
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
					//str +=		elements.row(elements.toolbar('ng-click="action()"'));
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'autocomplete', model:'currentAsset.name' , label : 'Company Name' , name : 'company_name' , required:true });
					str	+=			elements.form.input({ type:'text', colSize: 4, cls:'typeahead' , label : 'Company Type e.g Software , Construction ', name : 'company_cat' , model:'currentAsset.company_category[0].name' , required:true , asset :'company_category',typeahead : { datasets:'companyCats'}});
					//str	+=			elements.form.select({ colSize: 4, cls:'' , label : 'Company Category' , name : 'company_cat' , model:'currentAsset.company_category' , required:true ,asset:'company'});
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'autocomplete', model:'currentAsset.location.name' , label : 'Company Location' , name : 'company_location' , required:true });
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 8, cls:'', model:'currentAsset.address' , label : 'Company Address' , name : 'company_address' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentAsset.zipcode' , label : 'Zipcode' , name : 'zipcode' , required:false });
					str +=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Company Description' , name : 'company_description' , model:'currentAsset.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'email' ,colSize: 4, cls:'', model:'currentAsset.email' , label : 'Email Address' , name : 'email' , required:false });
					str	+=			elements.form.input({ type:'tel' ,colSize: 4, cls:'', model:'currentAsset.phone' , label : 'Phone Number' , name : 'phone' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentAsset.logo' , label : 'Company Logo' , name : 'logo' });
					str	+=		'</div>';
					str	+=	'</form>';
					
				return str;
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
	.service('jobs', function ($http,elements) {
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
					return $http.get($data+'/'+$id);
				}else{
					return	$http.get($data);
				}
			},
			/**
			 * Returns a $http.put or post promise
			 * @param {String} $name - The name of the PUT/POST endpoint
			 * @param {object} $data - The data for the PUT/POST request
			 * @param {integer} $id - The id for the PUT/POST enpoint
			 * @returns {Promise}
			 */
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				if($id){
					return $http.put($name+'/'+$id,$data);
				}else{
					return	$http.post($name,$data);
				}
			},
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
  .service('modal', function ($q,$compile) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	return	{
		modal	:	function(type,title,body,footer,$scope){
						
			var str	=	'',
				deferred	=	$q.defer();
			
			str	+=	'<div id="modal" class="modal '+type+'">';
			str += 		'<div class="container">';
			str	+=			'<div class="modal-content">';
			str += 				'<div class="row">';
			str	+=					title;
			str	+=				'</div>';
			str	+=				'<div class="row">'+body+'</div>';
			str	+=			'</div>';
			str	+=			footer ? '<div class="modal-footer">'+footer+'</div>' : '';
			str	+=		'</div>';
			str	+=	'</div>';
			
			angular.element('body').append($compile(str)($scope));
			
			deferred.resolve(str);
			
			angular.element('#modal').modal({ complete : function(){ angular.element('#modal').remove(); } }).modal('open');
			
			return deferred.promise;
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
