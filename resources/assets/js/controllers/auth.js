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
