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
				logo : $scope.currentAsset.phone,
				status : $scope.currentAsset.status
			}
			
			console.log('Data',this.data);
			/*
			company.sendData('companies',$route.current.params.companyId,this.data).then(function(result){
				console.log('Got a Response',result);
				$scope.cancel();
				////$scope.currentAsset = result.data;
			});
			*/
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
				
			});
		}
		
	});
