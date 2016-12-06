'use strict';

/**
 * @ngdoc service
 * @name jpApp.jobs
 * @description
 * # jobs
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('jobs', function ($http) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return{
			getJobs	:	function(){
				return	$http.get('jobs');
			}
		};
	});
