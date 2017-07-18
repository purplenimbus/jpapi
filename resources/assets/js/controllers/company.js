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
					style: 'mapbox://styles/mapbox/traffic-night-v2',
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
