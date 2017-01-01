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
