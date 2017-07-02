<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;

use App\Http\Requests;
use	App\Job;
use	App\Salary;
use	App\Job_Type;
use	App\Job_Category;
use	App\Job_Level;
use	App\Job_Skill;
use	App\Location;
use	App\Application;
use Illuminate\Support\Facades\DB;
use JWTAuth;
use Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use DatabaseSeeder as Seeder;
use Illuminate\Http\Response;

class JobController extends Controller
{
	var $job_types;
	var $job_cats;
	var $job_levels;
	var $job_skills;
	var $salary_types;
	var $min_qualifications;
	var $seeder;
	
    function __construct(){
		$this->seeder = New Seeder;
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
				
		//$this->middleware('jwt.auth',['only' => ['store','update','apply']]);
	}
	/**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {		
		$jobs	=	Job::all();
		
		if($jobs):
			foreach($jobs as $job){
				$job['company'] = isset($job->company->name) ? $job->company->name : '';
				$job['location'] = isset($job->location->name) ? $job->location->name : '';
				$job['job_type'] = isset($job->job_type->name) ? $job->job_type->name : '';
				$job['job_skills'] = isset($job->skills) ? Job_Skill::find(explode(',',$job->skills)) : '';
			}

		return $jobs->toJson();
		
		else:
			return response()->json(['message' => 'no jobs found'],401);
		endif;
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
		//var_dump($id);
		
        $job	=	Job::find($id);
		
		$application = Application::where('job_id',$id)->first();
		
		//$user = AuthenticateController->get_user();
		
		//var_dump(Auth);
		if($job):
			$job['company']			= isset($job->company->name) ? $job->company->name : '';
			$job['job_category'] 	= isset($job->job_category->name) ? $job->job_category->name : '';
			$job['job_type'] 		= isset($job->job_type->name) ? $job->job_type->name : '';
			$job['job_level'] 		= isset($job->job_level->name) ? $job->job_level->name : '';
			$job['job_salary'] 		= isset($job->job_salary->name) ? $job->job_salary->name : '';
			$job['location'] 		= isset($job->location->name) ? $job->location->name : '';
			$job['job_skills'] 		= isset($job->skills) ? Job_Skill::find(explode(',',$job->skills)) : '';
			$job['user_applied']	= false;//$application->user_id == $user->id ? true : false;
			
				
			return $job->toJson();
		else:
			return response()->json(['message' => 'no job found with the id '.$id],401);
		endif;
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
		$job		=	Job::find($id);
		
		$requests	=	$request->all();
		
		$data = array();
		
		echo "Data from wordpress"."\r\n";
		
		var_dump($requests);
		
		if($job):
			foreach($requests as $key => $req){
				if($request->has($key)){
					if($key == 'location'){
						//var_dump($request->input($key));
						$location = Location::where('ref_id', $request->input($key.'.ref_id'))->first();
											
						if(isset($location->id)){
							$job->job_location_id = $location->id;
							//update location 
						}else{
							//create new location
							$new_location = new Location;
							
							$new_location->name = $request->input($key.'.name');
							$new_location->locality = $request->input($key.'.locality');
							$new_location->city = $request->input($key.'.city');
							$new_location->city_code = $request->input($key.'.city_code');
							$new_location->state = $request->input($key.'.state');
							$new_location->state_code = $request->input($key.'.state_code');
							$new_location->country = $request->input($key.'.country');
							$new_location->country_code = $request->input($key.'.country_code');
							$new_location->zip_code = $request->input($key.'.zip_code');
							$new_location->lng = $request->input($key.'.lat');
							$new_location->lat = $request->input($key.'.lng');
							$new_location->ref_id = $request->input($key.'.ref_id');
							$new_location->url = $request->input($key.'.url');
							
							$new_location->save();
							//set job location id
							$job->job_location_id = $new_location->id;
						}
					}else{
						$job[$key]	=  $request->input($key);
						$data[$this->api_mapping($key)] =  $request->input($key);
					}
					
					//echo $request->input($key);
				}
			}
			
			var_dump($data);
			
			//$requests = (object)$requests;
			
			//Save to Wordpress
			if($request->has('wp_api') && $request->input('wp_api')){
				$response = $this->seeder->WP('POST','jobs/'.$job->wp_id,$data);
		
				if($response->getStatusCode() == 200){
					$job->save();
				}
				
			}else{
				$job->save();
			}
			
			$payload = json_encode($requests);
			
			return response()->json(['id'	=>	$job->id],200);
		else:
			response()->json([
				'message' => 'no job found with id '.$id,
			],404);
		endif;
		
		
		//$data['']
		/*
		$data = array(
			'title' => $request->input('title'),
			'content' => $request->input('description'),
			'categories' => array($request->input('job_category_id'))
		);*/
		
		
    }
	
	/**
     * Map Laravel columns to Wordpress
     *
     * @param  string  $key
     * @return string $mapping
     */
	 
	public function api_mapping($key){
		switch($key){
			case 'description' : return 'content'; break;
			case 'job_salary_id' : return 'categories'; break;
			case 'skills' : return 'tags'; break;
			default : return $key;
		}
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
     * Return a list of jobs based on location id
     *
     * @return object 
     */
	public function get_jobs($location_id,$job_id = null){
		if($job_id){
			return 'Found Jobs!!!';
		}else{
			$location = Location::find($location_id);
			if($location){
				$location['jobs'] = isset($location->jobs) ? $location->jobs : null;
				return $location->toJson();
			}else{
				return 'No Jobs Found';
			}
		}
	}
	/**
     * Return a list of jobs titles and their ids
     *
     * @return object 
     */
	public function job_titles(){
		$job = Job::get(['title','id']);
		
		return $job;
	}
	/**
     * Store applications
     *
     * @return object 
     */
	public function apply(Request $request){
		//TO DO add checks if application exsists
		$application = new Application;
		
		$application->job_id = $request->job_id;
		
		$application->user_id = Auth::user()->id;
		
		$application->save();
		
		return response()->json(['id'	=>	$application->id ],200);
	}
	
	/**
     * Store job updates from wordpress
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_jp_job_id($wp_id)
    {
        //
		$job = Job::where('wp_id',$wp_id)->value('id');
		
		var_dump($job);
		
		if($job){
			return response()->json($job,200);
		}else{
			return response()->json(['message'=>'job not found with wp id '.$wp_id],404);
		}
    }
}
