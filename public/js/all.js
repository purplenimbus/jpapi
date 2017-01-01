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
	.controller('AuthCtrl', function (/*$auth,$state,*/$rootScope,$scope,validation,form,elements,modal,jobs,companies,$location,$route) {
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
			});
		}
		
		if(!$rootScope.company.options){		
			companies.getData('companyoptions',false).then(function(result){
				console.log('Got a job options',result);
				$rootScope.company.options = result.data;
				$rootScope.company.options.company_status = [{
					id 		: 	1,
					name	:	'Draft',	
				},{
					id 		: 	2,
					name	:	'Published',	
				}];
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

'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:JobsCtrl
 * @description
 * # CompanysCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('CompanyCtrl', function ($scope,companies,jobs,$route,$location,$filter,modal,elements,$rootScope)
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
			companies.getData('companies',$route.current.params.companyId).then(function(result){
				$scope.currentCompany = result.data;
				//$scope.currentCompany.application_deadline = result.data.application_deadline ? new Date(result.data.application_deadline) : result.data.application_deadline;
				$scope.cache = $scope.currentCompany;
				console.log('Got a Company',$scope.currentCompany);
				$rootScope.$location.title = $scope.currentCompany.title;
				angular.element('.progress').hide();
			});
		};
		
		if(!$scope.currentCompany){
			$scope.init();
		}
		
		$scope.companyOptions = function(options) {
			switch(options){
				case 'company_status' :  return function(){
					var selected = $filter('filter')($rootScope.company.options.company_status, {value: $scope.currentCompany.status});
					return ($scope.currentCompany.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.updateCompany = function(){			
			
			this.data	=	{
				id : $scope.currentCompany.id,
				title : $scope.currentCompany.title,
				description : $scope.currentCompany.description,
				company_category_id : $scope.currentCompany.company_category.id,
				email : $scope.currentCompany.email,
				phone : $scope.currentCompany.phone,
				status : $scope.currentCompany.status,
			}
			
			console.log('Data',this.data);
			
			company.sendData('jobs',$route.current.params.companyId,this.data).then(function(result){
				console.log('Got a Response',result);
				$scope.cancel();
				////$scope.currentCompany = result.data;
			});
			
		}
		
		$scope.cancel = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentCompany = $scope.cache;
			$route.reload();
			$scope.init();
		}
		
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Company</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'job_category' , model:'currentCompany.status',colSize: 12,label1:'Draft',label2:'Published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'cancel()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateCompany()'	, label : 'Save'});
			
			modalBody	=	companies.editCompany();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'company_description' ).on( 'change', function( evt ) {
					$scope.currentCompany.description = evt.editor.getData();
				});
				
				angular.element('.chips-initial').on('chip.add', function(e, chip){
					$scope.currentCompany.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					$scope.currentCompany.required_skills = angular.element(this).material_chip('data');
				}).material_chip({
					placeholder: 'Skills',
					data: $scope.currentCompany.required_skills
				});
				
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
					
					$scope.currentCompany.location.name = place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						//console.log('Value',value);
						$scope.currentCompany.location[value.types[0]] = {};
						$scope.currentCompany.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						$scope.currentCompany.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
				});
				
				var slider = angular.element('#employees').get(0);
				
				noUiSlider.create(slider, {
					start: [0, 100],
					connect: true,
					step: 5,
					range: {
						'min': 0,
						'max': 1000
					},
					format: wNumb({
						decimals: 0,
						thousand: '.',
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					//console.log('Slider Changed',value);
					$scope.currentCompany.employees.value  = value;
					$scope.currentCompany.salary  = value.toString();
					$scope.currentCompany.employees.min = value[0];
					angular.element('.range-field span.min').html(value[0]);
					$scope.currentCompany.employees.max  = value[1];
					angular.element('.range-field span.max').html(value[1]);
				});
				
				/*
				$('.datepicker').pickadate({
					selectMonths: true, // Creates a dropdown to control month
				}).on('change',function(e){
					$scope.currentCompany.application_deadline = angular.element(e.currentTarget).val();
				});
				*/
				
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
	.controller('JobCtrl', function ($scope,jobs,$route,$location,$filter,modal,elements,$rootScope)
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
				$scope.currentJob = result.data;
				//$scope.currentJob.application_deadline = result.data.application_deadline ? new Date(result.data.application_deadline) : result.data.application_deadline;
				console.log('Date',result.data.application_deadline);
				$scope.cache = $scope.currentJob;
				$scope.currentJob.pay = {};
				console.log('Got a job',$scope.currentJob);
				$rootScope.$location.title = $scope.currentJob.title;
				angular.element('.progress').hide();
			});
		};
		
		if(!$scope.currentJob){
			$scope.init();
		}
		
		$scope.jobOptions = function(options) {
			switch(options){
				case 'job_status' :  return function(){
					var selected = $filter('filter')($rootScope.job.options.job_status, {value: $scope.currentJob.status});
					return ($scope.currentJob.status && selected.length) ? selected[0].text : 'Not set';
				}
				break;
			}
		};
		
		$scope.updateJob = function(){			
			
			this.data	=	{
				id : $scope.currentJob.id,
				title : $scope.currentJob.title,
				description : $scope.currentJob.description,
				company_id : $scope.currentJob.company.id,
				job_category_id : $scope.currentJob.job_category.id,
				job_type_id : $scope.currentJob.job_type.id,
				job_level_id : $scope.currentJob.job_level.id,
				application_deadline : $scope.currentJob.application_deadline,
				salary : $scope.currentJob.salary,
				status : $scope.currentJob.status,
				min_experience : $scope.currentJob.min_experience,
				min_qualification : $scope.currentJob.min_qualification.name,
			}
			
			console.log('Data',this.data);
			
			jobs.sendData('jobs',$route.current.params.jobId,this.data).then(function(result){
				console.log('Got a Response',result);
				$scope.cancel();
				////$scope.currentJob = result.data;
			});
			
		}
		
		$scope.cancel = function(){
			console.log('Edit Cancelled');
			angular.element('#modal').modal('close');
			//angular.element('#job_location').val('');
			//angular.element('#modal form').get(0).reset();
			//$scope.currentJob = $scope.cache;
			$route.reload();
			$scope.init();
		}
		
		$scope.edit = function(){
			var modalType	=	'bottom-sheet',
				modalTitle	=	'',
				modalBody	=	'',
				modalFooter	=	'';
			
			modalTitle	+=	'<h4 class="left">Edit Job</h4>';
			modalTitle	+=	'<div class="right">'+elements.form.check({name : 'job_category' , model:'currentJob.status',colSize: 12,label1:'Draft',label2:'Published'})+'</div>';
			
			modalFooter	+=	elements.button({	type	:	'button',	cls:	'btn  red accent-4',	ngClick	:	'cancel()'	, label : 'Cancel'});
			modalFooter	+=	elements.button({	type	:	'submit',	cls:	'btn',	ngClick	:	'updateJob()'	, label : 'Save'});
			
			modalBody	=	jobs.editJob();
			
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				angular.element('select').material_select();
				
				CKEDITOR.editorConfig	=	function( config ){
					config.toolbar	=	[
						{name:'clipboard',items:['Cut','Copy','Paste','PasteText','Undo','Redo']},
						{name:'paragraph',items:['NumberedList','BulletedList']}
					];
				};
				
				CKEDITOR.replace( 'job_description' ).on( 'change', function( evt ) {
					$scope.currentJob.description = evt.editor.getData();
				});
				
				angular.element('.chips-initial').on('chip.add', function(e, chip){
					$scope.currentJob.required_skills = angular.element(this).material_chip('data');
				}).on('chip.delete', function(e, chip){
					$scope.currentJob.required_skills = angular.element(this).material_chip('data');
				}).material_chip({
					placeholder: 'Skills',
					data: $scope.currentJob.required_skills
				});
				
				// Create the autocomplete object, restricting the search to geographical
				// location types.
				autocomplete = new google.maps.places.Autocomplete(
					/** @type {!HTMLInputElement} */(angular.element('input#job_location').get(0)),
					{types: ['geocode']});

				// When the user selects an address from the dropdown, populate the address
				// fields in the form.
				autocomplete.addListener('place_changed', function(){
					var place = this.getPlace();
					
					//console.log('Place',place);
					
					$scope.currentJob.location.name = place.name ? place.name : '';
					
					place.address_components.map(function(value,key){
						//console.log('Value',value);
						$scope.currentJob.location[value.types[0]] = {};
						$scope.currentJob.location[value.types[0]].long_name = value.long_name ? value.long_name : '';
						$scope.currentJob.location[value.types[0]].short_name = value.short_name ? value.short_name : '';
					});
				});
				
				var slider = angular.element('#pay').get(0);
				
				noUiSlider.create(slider, {
					start: [0, 100],
					connect: true,
					step: 5,
					range: {
						'min': 0,
						'max': 1000
					},
					format: wNumb({
						decimals: 0,
						thousand: '.',
						prefix: '$',
						postfix: ',000',
					})
				});
				
				slider.noUiSlider.on('update', function(value,handle){
					//console.log('Slider Changed',value);
					$scope.currentJob.pay.value  = value;
					$scope.currentJob.salary  = value.toString();
					$scope.currentJob.pay.min = value[0];
					angular.element('.range-field span.min').html(value[0]);
					$scope.currentJob.pay.max  = value[1];
					angular.element('.range-field span.max').html(value[1]);
				});
				
				
				$('.datepicker').pickadate({
					selectMonths: true, // Creates a dropdown to control month
				}).on('change',function(e){
					$scope.currentJob.application_deadline = angular.element(e.currentTarget).val();
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
			getData	:	function($data,$id){
				console.log($data+' id',$id);
				if($id){
					return $http.get($data+'/'+$id);
				}else{
					return	$http.get($data);
				}
			},
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				if($id){
					return $http.put($name+'/'+$id,$data);
				}else{
					return	$http.post($name,$data);
				}
			},
			editCompany		:	function(){
				var str	=	'';
				
					str	+=	'<form>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentCompany.name' , label : 'Company Name' , name : 'company_name' , required:true });
					str	+=			elements.form.select({ colSize: 6, cls:'' , label : 'Company Category' , name : 'company_category' , model:'currentCompany.company_category' , required:true});
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentCompany.location.name' , label : 'Company Location' , name : 'company_location' , required:true });
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'address' ,colSize: 4, cls:'', model:'currentCompany.address' , label : 'Company Address' , name : 'compant_address' , required:false });
					str +=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Company Description' , name : 'company_description' , model:'currentCompany.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'email' ,colSize: 4, cls:'', model:'currentCompany.email' , label : 'Email Address' , name : 'email' , required:false });
					str	+=			elements.form.input({ type:'tel' ,colSize: 4, cls:'', model:'currentCompany.phone' , label : 'Phone Number' , name : 'phone' , required:false });
					str	+=			elements.form.input({ type:'text' ,colSize: 4, cls:'', model:'currentCompany.logo' , label : 'Company Logo' , name : 'logo' });
					str	+=		'</div>';
					str	+=	'</form>';
					
				return str;
			}
		};
	});

'use strict';

/**
 * @ngdoc service
 * @name jpApp.elements
 * @description
 * # elements
 * Factory in the jpApp.
 */
angular.module('jpApp')
  .factory('elements', function () {
    return {
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
		form	:	{
			
			input	:	function(object){
				var	str	=	'';
				
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
				str	+=	'>';
				str	+=	'<label ';
				str	+=	object.model	?	' class="active" '	:	'';
				str	+=  'for="'+object.name+'">';
				str	+=	object.label ?  object.label+(object.required ? ' *' : '') : '';
				str +=  '</label>';
				str +=  '</div>';

				return str;
			},
			
			inputGroup	:	function(icon,object){
				var str		=	'',
					self	=	this;
		
				str	+=	'<div class="input-field">';
				str	+=		'<i class="material-icons prefix">'+icon+'</i>';
				str	+=		self.input(object);
				str	+=	'</div>';
				
				return str;
			},
			
			select	:	function(object){
				var str	=	'';
				
				str +=	'<div class="input-field col m'+object.colSize.toString()+' s12">';
				str +=	'<select ';
				str +=	object.cls ? 'class="'+object.cls+'"' : '';
				str +=	object.model ? 'ng-model="'+object.model+'"' : '';
				str	+=	object.name	?	' name="'+object.name+'" id="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true" required="true"'	:	'';
				str +=	'ng-options="g as g.name for g in $root.job.options.'+object.name+'s track by g.id">';
				//str +=	'<option value="" disabled selected>Choose your option</option>';
				str +=	'</select>';
				str +=	object.label ? '<label>'+object.label+(object.required ? ' *' : '')+'</label>' : '';
				str +=	'</div>';
				return str;
			},
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
			chips	:	function(object){
				var str	=	'';
				
				str	+=	' <div class="chips '+object.chipType+'"></div>';
				return 	str;
			},
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
			}
		},
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
			
			register	:	function(){
				var str	=	'';
				
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
			getData	:	function($data,$id){
				console.log($data+' id',$id);
				if($id){
					return $http.get($data+'/'+$id);
				}else{
					return	$http.get($data);
				}
			},
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				if($id){
					return $http.put($name+'/'+$id,$data);
				}else{
					return	$http.post($name,$data);
				}
			},
			editJob		:	function(){
				var str	=	'';
				
					str	+=	'<form>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 3, cls:'autocomplete', model:'currentJob.title' , label : 'Job Title' , name : 'job_title' , required:true });
					str	+=			elements.form.select({ colSize: 3, cls:'' , label : 'Job Type' , name : 'job_type' , model:'currentJob.job_type' , required:true});
					str	+=			elements.form.select({ colSize: 3, cls:'' , label : 'Job Level' , name : 'job_level' , model:'currentJob.job_level' , required:true});
					str	+=			elements.form.select({ colSize: 3, cls:'' , label : 'Job Category' , name : 'job_category' , model:'currentJob.job_category' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentJob.location.name' , label : 'Job Location' , name : 'job_location' , required:true });
					str	+=			elements.form.select({ colSize: 6, cls:'' , model:'currentJob.min_qualification' , label : 'Minimum Qualification' , name : 'job_min_qualification' });
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.range({ colSize: 12, cls:'', model:'currentJob.min_experience' , label : 'Minimum Experience' , name : 'job_min_experience' , min:0,max:15 });
					str	+=		'</div>';			
					str	+=		'<div class="row">';
					str	+=			'<div class="range-field col m12">';
					str	+=				'<label>Salary <span class="min"></span> - <span class="max"></span> {{ currentJob.salary_type.name }}</label>';
					str	+=				'<div id="pay"></div>';
					str	+=			'</div>';
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.select({ colSize: 12, cls:'', model:'currentJob.salary_type' , label : 'Salary Type' , name : 'salary_type' , required:true });
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Job Description' , name : 'job_description' , model:'currentJob.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			'<div class="range-field col m12">';
					str	+=			'<label>Required Skills</label>';
					str	+=			elements.form.chips({ colSize: 12, cls:'' , label : 'Required Skills' , name : 'required_skills' , model:'currentJob.required_skills',chipType : 'chips-initial'});
					str	+=			'</div>';
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.date({ colSize: 12, cls:'' , label : 'Application Deadline' , name : 'application_deadline' , model:'currentJob.application_deadline', required:true });
					str	+=		'</div>';
					str	+=	'</form>';
					
				return str;
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
