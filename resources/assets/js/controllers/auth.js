'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.controller('AuthCtrl', function (/*$auth,$state,*/$rootScope,$scope,validation,form,elements,modal,jobs,$location,$route) {
		this.awesomeThings = [
		  'HTML5 Boilerplate',
		  'AngularJS',
		  'Karma'
		];
		
		if(!$rootScope.job){
			$rootScope.job = {
				
			};
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
		
	});
