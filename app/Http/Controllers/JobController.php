<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use	App\Job;
use	App\Job_Type;
use	App\Job_Category;
use	App\Job_Level;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {		
		$jobs	=	Job::all();
		
		foreach($jobs as $job){
			$job['company'] = $job->company->name;
		}

		return $jobs->toJson();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $job	=	Job::findorfail($id);
		
		$job['company']			= $job->company->name;
		$job['job_category'] 	= $job->job_category->name;
		$job['job_type'] 		= $job->job_type->name;
		$job['job_level'] 		= $job->job_level->name;
		
		
		
		return $job->toJson();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
		$job		=	Job::findorfail($id);
		
		$requests	=	$request->all();
		
		foreach($requests as $key => $req){
			if($request->has($key)){
				$job[$key]	=	$request->input($key);
				//echo $request[$key];
			}
		}
		
		$job->save();
		
		$payload = json_encode($requests);
		
		return json_encode((object)['id'	=>	$job->id , 'payload'	=>	$payload ]);		
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
	
	/**
     * Return a list of job options i.e job types , job category and job levels
     *
     * @return \Illuminate\Http\Response
     */
    public function joboptions()
    {
        //
		$job_types = Job_Type::all();
		$job_levels = Job_Level::all();
		$job_cats = Job_Category::all();
		
		$job_options = [
			"job_levels" => $job_levels,
			"job_categories" => $job_cats,
			"job_types" => $job_types
		];
		
		return json_encode($job_options);
    }
	
}
