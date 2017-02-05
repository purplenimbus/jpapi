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
//Job Categories
Route::get('job_categories', 'JobController@job_categories');
Route::get('job_levels', 'JobController@job_levels');
Route::get('job_types', 'JobController@job_types');
Route::get('job_skills', 'JobController@job_skills');
Route::get('salary_types', 'JobController@salary_types');
Route::get('min_qualifications', 'JobController@min_qualifications');

Route::resource('jobs', 'JobController', [
	'only' 	=> ['index','show','update','store','jobtypes'],
	'names' => ['jobtypes' => 'jobs.jobtypes']
]);

Route::get('company/categories', 'CompanyController@company_categories');

Route::resource('companies', 'CompanyController', [
	'only' 	=> ['index','show','update','store','companytypes'],
	'names' => ['companytypes' => 'companies.companytypes']
]);

Route::get('locations/{location_id}/jobs', 'JobController@get_jobs');


