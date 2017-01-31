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
			/**
			 * Returns the form to edit jobs
			 * @returns {String}
			 */
			editJob		:	function(){
				var str	=	'';
				
					str	+=	'<form>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.title' , label : 'Job Title' , name : 'job_title' , required:true });
					str	+=			elements.form.input({ type:'text', colSize: 2, cls:'' , label : 'Job Type Typeahead' , name : 'job_type' , model:'currentAsset.job_type' , required:true , asset :'job',typeahead : { datasets:'jobTypes'}});
					str	+=			elements.form.select({ colSize: 2, cls:'hide' , label : 'Job Type' , name : 'job_type' , model:'currentAsset.job_type' , required:true , asset :'job'});
					str	+=			elements.form.select({ colSize: 2, cls:'' , label : 'Job Level' , name : 'job_level' , model:'currentAsset.job_level' , required:true, asset :'job'});
					str	+=			elements.form.select({ colSize: 2, cls:'' , label : 'Job Category' , name : 'job_cat' , model:'currentAsset.job_category' , required:true, asset :'job'});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.input({ type:'text' ,colSize: 6, cls:'autocomplete', model:'currentAsset.location.name' , label : 'Job Location' , name : 'job_location' , required:true });
					str	+=			elements.form.select({ colSize: 6, cls:'' , model:'currentAsset.min_qualification' , label : 'Minimum Qualification' , name : 'job_min_qualification' , asset :'job'});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.range({ colSize: 12, cls:'', model:'currentAsset.min_experience' , label : 'Minimum Experience' , name : 'job_min_experience' , min:0,max:15 });
					str	+=		'</div>';			
					str	+=		'<div class="row">';
					str	+=			'<div class="range-field col m12">';
					str	+=				'<label>Salary <span class="min"></span> - <span class="max"></span> {{ currentAsset.salary_type.name }}</label>';
					str	+=				'<div id="pay"></div>';
					str	+=			'</div>';
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.select({ colSize: 12, cls:'', model:'currentAsset.salary_type' , label : 'Salary Type' , name : 'salary_type' , required:true , asset :'job'});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.textarea({ colSize: 12, cls:'' , label : 'Job Description' , name : 'job_description' , model:'currentAsset.description' , required:true});
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			'<div class="range-field col m12">';
					str	+=			'<label>Required Skills</label>';
					str	+=			elements.form.chips({ colSize: 12, cls:'' , label : 'Required Skills' , name : 'required_skills' , model:'currentAsset.required_skills',chipType : 'chips-initial'});
					str	+=			'</div>';
					str	+=		'</div>';
					str	+=		'<div class="row">';
					str	+=			elements.form.date({ colSize: 12, cls:'' , label : 'Application Deadline' , name : 'application_deadline' , model:'currentAsset.application_deadline', required:true });
					str	+=		'</div>';
					str	+=	'</form>';
					
				return str;
			}
		};
	});
