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


Route::group(['prefix'	=>	'api'],function(){
	
	//Authentication
	Route::post('login',	'AuthenticateController@authenticate');
	//Oauth
	Route::post('auth/linkedin', 'AuthenticateController@linkedin');
	Route::get('auth/callback',	'AuthenticateController@oauthcallback');
	Route::get('profile/{id}',	'AuthenticateController@getProfile');
	Route::post('profile/{id}',	'AuthenticateController@saveProfile');

	
	Route::get('joboptions', 'JobController@joboptions'); //Remove Possibly
	//End points for Job Options
	Route::get('job_categories', 'JobController@job_categories');
	Route::get('job_levels', 'JobController@job_levels');
	Route::get('job_types', 'JobController@job_types');
	Route::get('job_skills', 'JobController@job_skills');
	Route::get('salary_types', 'JobController@salary_types');
	Route::get('min_qualifications', 'JobController@min_qualifications');
	
	//Wordpress API
	Route::post('jobs/wp/{wp_id}', 'JobController@get_jp_job_id');
	Route::post('wp/{wp_id}', 'WordpressController@update');
	
	//TO DO Refactor or Remove
	Route::resource('jobs', 'JobController', [
		'only' 	=> ['index','show','update','store','job_types'],
		'names' => ['jobtypes' => 'jobs.job_types']
	]);
	
	Route::get('locations/{location_id}/jobs/', 'JobController@get_jobs'); //Search jobs based on locaton
	Route::get('locations/{location_id}/jobs/{job_id}', 'JobController@get_jobs'); //Search jobs based on locaton id and job id
	Route::get('job_titles', 'JobController@job_titles'); //Get Job Titles
	
	Route::get('company/categories', 'CompanyController@company_categories'); //Get Company Categories

	Route::resource('companies', 'CompanyController', [
		'only' 	=> ['index','show','update','store','companytypes'],
		'names' => ['companytypes' => 'companies.companytypes']
	]);
	
	Route::put('jobs/{job_id}/apply', 'JobController@apply');
	//Route::get('job/{job_id}/apply/apply_id', 'JobController@apply');
	Route::get('jobs/{job_id}/applications', 'JobController@get_applications');
	Route::get('myaccount', 'AuthenticateController@get_user');
});




