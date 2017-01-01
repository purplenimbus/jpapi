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
