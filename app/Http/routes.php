<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('layouts.pages.home');
});


/*Route::group(['prefix'	=>	'api'],function(){
	Route::resource('authenticate',	'AuthenticateController',	['only'	=>	['index']]);
	
	Route::post('authenticate',	'AuthenticateController@authenticate');
});*/

//Job Routes

Route::get('joboptions', 'JobController@joboptions');

Route::resource('jobs', 'JobController', [
	'only' 	=> ['index','show','update','store','jobtypes'],
	'names' => ['jobtypes' => 'jobs.jobtypes']
]);

Route::get('companyoptions', 'CompanyController@companyoptions');

Route::resource('companies', 'CompanyController', [
	'only' 	=> ['index','show','update','store','jobtypes'],
	'names' => ['companytypes' => 'companies.companytypes']
]);


