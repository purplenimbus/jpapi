'use strict';

/**
 * @ngdoc service
 * @name jpApp.jobs
 * @description
 * # jobs
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('jobs', function ($http,elements,$rootScope,$auth) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			/**
			 * Returns a $http.get promise to get a job based on the job id
			 * @param {object} $data - The data for the GET request
			 * @param {integer} $id - The id for the GET request
			 * @returns {Promise}
			 */
			getData	:	function($data,$id,$params){	
				var logged_in = $auth.isAuthenticated();
								
				return	$http.get('api/'+$data+($id ? '/'+$id : '')+(logged_in ? '?token='+$auth.getToken() : ''));
			},
			/**
			 * Returns a $http.put or post promise to store a job based on job id and its data
			 * @param {String} $name - The name of the PUT/POST endpoint
			 * @param {object} $data - The data for the PUT/POST request
			 * @param {integer} $id - The id for the PUT/POST enpoint
			 * @returns {Promise}
			 */
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				return	$http.post('api/'+$name+($id ? '/'+$id : ''),$data);
			},
			/**
			 * Returns a $http.put or post promise to store a job based on job id and its data
			 * @param {String} $name - The name of the PUT/POST endpoint
			 * @param {object} $data - The data for the PUT/POST request
			 * @param {integer} $id - The id for the PUT/POST enpoint
			 * @returns {Promise}
			 */
			findJobs : function(location_id,job_id){
				return $http.get('api/locations/'+location_id+'/jobs/'+job_id);
			}
		};
	});
