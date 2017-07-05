<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Model;

use	App\Job;
use	App\Salary;
use	App\Job_Type;
use	App\Job_Category;
use	App\Job_Level;
use	App\Job_Skill;
use	App\Location;
use	App\Application;

class WordpressController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }
	/**
     * Store wordpress resources
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update($id,Request $request)
    {		
		$model_type = $request->jp_model;
		
		$wp_id 		= $request->wp_id;
		
		//echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		//echo "WP ID : ".$id." , MODEL TYPE : ".$model_type." , WORDPRESS ID : ".$wp_id." \r\n";
		
		//echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		switch($model_type){
			case 'jobs' : $data = $this->job($request); break;
		}
		
		//echo "++++++++++++++++++ WP DATA +++++++++++++++++++++ \r\n";
				
		//var_dump($data);
		
		//echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";

		return response()->json(['id' => $data->id ],200);

    }
	
	/**
     * Job Model
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    private function job($request){
		
		$wp_id 		= $request->wp_id;
		
		$sample_job = new Job;
		
		$data = $this->parse_request($request,$sample_job->getFillable());
								
		$job = Job::updateOrCreate(['wp_id' => $wp_id],$data);
								
		return $job;
	}
	
	/**
     * Get jp model id based on wp id
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function get_jp_resource_id($wp_id,$model){
		
		$model_name = "App\\".$model;
		try{
			$resource = $model_name::where('wp_id', $wp_id)->first();
			
			if($resource->id){
				return $resource->id;
			}else{
				return false;
			}
		}catch(Exception $e) {
			return $e->getMessage();
		}
		
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
				
		if($job){
			return response()->json($job,200);
		}else{
			return response()->json(['message'=>'job not found with wp id '.$wp_id],404);
		}
    }
	/**
     * Parse request for valid data
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  required fields to return from request
     * @return \Illuminate\Http\Response
     */
	
	private function parse_request($request,$array){
		
		$requests = $request->all();
				
		foreach($requests as $key => $req){
						
			if(array_search($key,$array) === false){
				unset($requests[$key]);
			}
		}
		
		return $requests;
	}
}
