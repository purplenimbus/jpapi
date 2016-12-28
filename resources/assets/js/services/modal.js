'use strict';

/**
 * @ngdoc service
 * @name jpApp.modalService
 * @description
 * # modalService
 * Service in the jpApp.
 */
angular.module('jpApp')
  .service('modal', function ($q,$compile) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	return	{
		modal	:	function(type,title,body,footer,$scope){
						
			var str	=	'',
				deferred	=	$q.defer();
			
			str	+=	'<div id="modal" class="modal '+type+'">';
			str	+=		'<div class="modal-content">';
			str	+=			'<h4>'+title+'</h4>';
			str	+=			body;
			str	+=		'</div>';
			str	+=		footer ? '<div class="modal-footer">'+footer+'</div>' : '';
			str	+=	'</div>';
			
			angular.element('body').append($compile(str)($scope));
			
			deferred.resolve(str);
			
			angular.element('#modal').modal({ complete : function(){ angular.element('#modal').remove(); } }).modal('open');
			
			return deferred.promise;
		}
	};
  });
