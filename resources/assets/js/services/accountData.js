'use strict';

/**
 * @ngdoc function
 * @name jpApp.controller:accountData
 * @description
 * # JobsCtrl
 * Controller of the jpApp
 */
angular.module('jpApp')
	.service('accountData', function ($q,$http,jobs)
	{
		return {
			getUserData : function(){
				return $http.get('/api/myaccount');
			},
			saveData 	:	function(){
				return $http.post('/api/myaccount');
			},
			getJobs		:	function(id){
				return $http.get('/api/myaccount/{'+id+'}/jobs');
			}
		};
	});
