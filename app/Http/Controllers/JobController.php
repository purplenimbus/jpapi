<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use	App\Job;
use	App\Salary;
use	App\Job_Type;
use	App\Job_Category;
use	App\Job_Level;
use	App\Job_Skill;


class JobController extends Controller
{
	var $job_types;
	var $job_cats;
	var $job_levels;
	var $job_skills;
	var $salary_types;
	var $min_qualifications;
	
    function __construct(){
		$this->job_types = Job_Type::all();
		$this->job_levels = Job_Level::all();
		$this->job_cats = Job_Category::all();
		$this->job_skills = Job_Skill::all();
		$this->salary_types = Salary::all();
		$this->min_qualifications = [
				[
					'id' => 0,
					'name' => 'None'
				],[
					'id' => 1,
					'name' => 'Highschool Diploma'
				],[
					'id' => 2,
					'name' => 'University Diploma'
				],[
					'id' => 3,
					'name' => 'Univerisity Degree (Bsc)'
				],[
					'id' => 4,
					'name' => 'Masters Degree (Msc)'
				],[
					'id' => 5,
					'name' => 'Doctorate (Phd)'
				]
			];
	}
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
		
		//unset($job['company']['']);
		
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
				$job[$key]	=  $request->input($key);
				//echo $request->input($key);
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
     * Return a list of job categories
     *
     * @return string 
     */
    public function job_categories()
    {
		return $this->job_cats->toJson();
	}
	
	/**
     * Return a list of job types
     *
     * @return string 
     */
    public function job_types()
    {
		return $this->job_types->toJson();
	}
	
	/**
     * Return a list of job levels
     *
     * @return string 
     */
    public function job_levels()
    {
		return $this->job_levels->toJson();
	}
	
	/**
     * Return a list of job skills
     *
     * @return string 
     */
    public function job_skills()
    {
		return $this->job_skills->toJson();
	}
	
	/**
     * Return a list of salary types
     *
     * @return string 
     */
    public function salary_types()
    {
		return $this->salary_types->toJson();
	}
	
	/**
     * Return a list of job qualifications
     *
     * @return string 
     */
    public function min_qualifications()
    {
		return json_encode($this->min_qualifications);
	}
	
	/**
     * Return a list of job options i.e job types , job category and job levels
     *
     * @return \Illuminate\Http\Response
     */
	/*
    public function joboptions()
    {
		
		$job_options = [
			"job_levels" => $this->job_levels,
			"job_cats" => $this->job_cats,
			"job_skills" => $this->job_skills,
			"job_types" => $this->job_types,
			"salary_types" => $this->salary_types,
			"job_min_qualifications" 		=> [
				[
					'id' => 0,
					'name' => 'None'
				],[
					'id' => 1,
					'name' => 'Highschool Diploma'
				],[
					'id' => 2,
					'name' => 'University Diploma'
				],[
					'id' => 3,
					'name' => 'Univerisity Degree (Bsc)'
				],[
					'id' => 4,
					'name' => 'Masters Degree (Msc)'
				],[
					'id' => 5,
					'name' => 'Doctorate (Phd)'
				]
			]

		];
		
		return json_encode($job_options);
    }
	*/
}
