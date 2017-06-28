'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('AuthCtrl', function ($auth,$state,$rootScope,$scope,validation,form,elements,modal,jobs,companies,$location,$route,auth) {
		
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
				
				if(result.valid){											
					//Use Satellizer's $auth service to login
					$auth.login(credentials).then(function(result) {
						console.log('Data',result);
						$rootScope.user = {};
						console.log('Logged in Rootscope',$rootScope);
						console.log('Logged in Auth',$auth.isAuthenticated());
						console.log('Logged in token',$auth.getToken());
						console.log('Logged in payload',$auth.getPayload());
						auth.setCookie('auth',JSON.stringify(result.data.user),9);
						$rootScope.user.info = result.data.user;
						$scope.closeModal();
					}).catch(function(error){
						console.log('Login Error',error);
						//TO DO Add Error Message to login modal
					});
					
				}else{
					console.log(result);
					//TO DO Add Validation Error Message to login modal
				}	
				
			});
			
            
        };
		
		$scope.showLoginModal	=	function(){
			var modalType	=	'uk-modal-dialog-small',
				modalTitle	=	'<h4 class="left">Login</h4>',
				modalBody	=	form.login(),
				modalFooter	=	'';//elements.button({	type	:	'submit',	cls:	'btn teal accent-3',	ngClick	:	'login($event)'	},'Login');
				
			modal.modal(modalType,modalTitle,modalBody,modalFooter,$scope).then(function(result){
				//console.log(result);
				console.log('Auth Details',$rootScope);
				
			});
		};
		
		$scope.authenticate = function(provider) {
			$auth.authenticate(provider);
		};
		
		$scope.logout = function() {
			$auth.logout();
			
			$location.path("/");
		};
		
		$scope.closeModal	=	function(){
			angular.element('#modal').hide();
		};
	
	});
