'use strict';

/**
 * @ngdoc function
 * @name jpApp.service:accountData
 * @description
 * # JobsCtrl
 * Service of the jpApp
 */
angular.module('jpApp')
	.service('accountData', function ($q,$http,jobs)
	{
		return {
			user		: null,
			getUserData : function(id){
				return $http.get('/api/profile/'+id);
			},
			saveData 	:	function(id,data){
				return $http.post('/api/profile/'+id,data);
			},
			getJobs		:	function(id){
				return $http.get('/api/profile/{'+id+'}/jobs');
			}
		};
	});
