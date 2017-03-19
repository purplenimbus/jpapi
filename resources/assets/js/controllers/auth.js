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
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		
		//var vm = this;
		
		angular.element('.button-collapse').sideNav({
			  menuWidth: 300, // Default is 300
			  edge: 'right', // Choose the horizontal origin
			  closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
			  draggable: true // Choose whether you can drag to open on touch screens
			}
		);
		
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
		
		$scope.signIn	=	function(){
			var modalType	=	'',
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
			angular.element('#modal').modal('close');
		};
		
		//Activate account dropdown
		angular.element('.dropdown-button').dropdown({
		  inDuration: 300,
		  outDuration: 225,
		  constrainWidth: false, // Does not change width of dropdown to that of the activator
		  hover: true, // Activate on hover
		  gutter: 0, // Spacing from edge
		  belowOrigin: true, // Displays dropdown below the button
		  alignment: 'left', // Displays dropdown with edge aligned to the left of button
		  stopPropagation: false // Stops event propagation
		});
	
	});
