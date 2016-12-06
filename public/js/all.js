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
				controllerAs	:	'main'
			})
			.when('/jobs',{
				templateUrl	:	'/views/jobs.html',
				controller	:	'JobsCtrl',
				controllerAs: 	'jobs'
			})
			.otherwise({
				templateUrl : 	'Not Found'
			});

		//$locationProvider.html5Mode(true);
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
	.controller('AuthCtrl', function ($auth,$state,$rootScope,$scope,validation,form,elements,modal) {
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
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
			var modalType	=	'small',
				modalTitle	=	'Login',
				modalBody	=	form.login(),
				modalFooter	=	elements.button({	type	:	'submit',	cls:	'btn-primary btn-lg btn-block',	ngClick	:	'login($event)'	},'Login');
				
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				console.log(result);
				
			});
		};
		
		$scope.closeModal	=	function(){
			angular.element('#modal').modal('hide').remove();
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
	.controller('JobsCtrl', function ($scope,jobs)
	{
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		$scope.init	=	function(){
			jobs.getJobs().then(function(result){
				console.log('result',result);
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
				str	+=	'<div class="col-md-'+num+'">';
				str	+=		body;
				str	+=	'</div>';
				
				return str;
			}else{
				str	+=	'<div class="col-md-'+num[0]+' col-xs-'+num[1]+'">';
				str	+=		body;
				str	+=	'</div>';
				
				return str;
			}
		},
		button	:	function(object,body){
			var str	=	'';
			
			str	+=	'<button class="btn '+object.cls+'"';
			str	+=		object.type		?	'type="'+object.type+'"'	:	'';
			str	+=		object.ngClick	?	'ng-click="'+object.ngClick+'">'	:	'>';
			str	+=		body;
			str	+=	'</button>';
			
			return str;
		},
		form	:	{
			
			input	:	function(object){
				var	str	=	'';
				
				str	+=	'<input type="'+object.type+'"';
				str	+=	'class="form-control '+object.cls+'"';
				str	+=	object.id	?	' id="'+object.id+'"'	:	'';
				str	+=	' placeholder="'+object.placeholder+'"';
				str	+=	object.model	?	' ng-model="'+object.model+'"'	:	'';
				str	+=	object.name	?	' name="'+object.name+'"'	:	'';
				str	+=	object.required	?	' data-required="true"'	:	'';
				str	+=	'>';
			
				return str;
			},
			
			inputGroup	:	function(icon,object){
				var str		=	'',
					self	=	this;
				
				str	+=	'<div class="input-group">';
				str	+=		'<span class="input-group-addon">'+icon+'</span>';
				str	+=		self.input(object);
				str	+=	'</div>';
				
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
				str	+=	elements.column(12,elements.form.inputGroup(elements.glyph('user'),{ 	
														type		:	'email',	
														cls			:	'input-lg'	,	
														placeholder	:	'Email'	,	
														model		:	'',
														name		:	'email',
														required	:	true
													}));
				str	+=	'</div>';
				str	+=	'<div class="row form-group">';
				str	+=	elements.column(12,elements.form.inputGroup(elements.glyph('lock'),{ 	
														type		:	'password',	
														cls			:	'input-lg'	,	
														placeholder	:	'Password'	,	
														model		:	'',
														name		:	'password',
														required	:	true
													}));
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
	.service('jobs', function ($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			getJobs	:	function(){
				return	$http.get('jobs');
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
			
			str	+=	'<div id="modal" class="modal fade" tabindex="-1" role="dialog">';
			str	+=		'<div class="modal-dialog '+((type === 'small') ? 'modal-sm' : ( type === 'large ') ? 'modal-lg' : '' )+'" role="document">';
			str	+=			'<div class="modal-content">';
			str	+=				'<div class="modal-header">';
			str	+=					'<button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="closeModal($event)"><span aria-hidden="true">&times;</span></button>';
			str	+=					'<h4 class="modal-title">'+title+'</h4>';
			str	+=				'</div>';
			str	+=				'<div class="modal-body">'+body+'</div>';
			str	+=				footer ? '<div class="modal-footer">'+footer+'</div>' : '';
			str	+=			'</div>';
			str	+=		'</div>';
			str	+=	'</div>';
			
			angular.element('body').append($compile(str)($scope));
			
			deferred.resolve(str);
			
			angular.element('#modal').modal('show').on('hidden.bs.modal', function () {
				this.remove();
			});
			
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
