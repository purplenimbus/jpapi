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
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		echo "WP ID : ".$id." , MODEL TYPE : ".$model_type." , WORDPRESS ID : ".$wp_id." \r\n";
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		switch($model_type){
			case 'jobs' : $data = $this->job($request); break;
		}
				
		//var_dump($data);
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";

		return response()->json(['data' => $data],200);

    }
	
	/**
     * Job Model
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    private function job($request){
		echo "JP MODEL OBJECT \r\n";
				
		$requests = $request->all();
		
		$wp_id 		= $request->wp_id;
		
		$sample_job = new Job;
							
		$data = array();
		
		foreach($requests as $key => $req){
			
			if($request->has($key)){
				echo "key : ".$key."\r\n";
				echo "Value Type : ".gettype($request[$key])."\r\n";
				echo "Fillable? ".(array_search($key,$sample_job->assignable) !== false)."\r\n";
				//echo "----------------SAMPLE JOB------------------------- \r\n";
				//var_dump(array_search($key,$sample_job->assignable));
				echo "------------------------------------------------ \r\n";
				
				switch(gettype($request[$key])){
					case 'array' : 
						echo "ARRAY \r\n";
						echo "------------------------------------------------ \r\n";
						var_dump($request[$key]);
						
						$data[$this->map_array_fields($key)];
						
						break;
					
					default : 
						//echo "STRING  : ".$request[$key]." \r\n";
						//echo "------------------------------------------------ \r\n";
						if(array_search($key,$sample_job->assignable) !== false && ($key !== 'wp_api' || $key !== 'jp_model')){
							$data[$key] = $request->input($key);
						}else{
							continue;
						}
						
						break;
				}
			}
			//echo "Job Data : ".$key."\r\n";
		}
		
		echo "Job Data for Input : \r\n";
		
		return $data;
		
		/*
		$job = Job::where('wp_id' , $wp_id)->get();
		
		if($job){
			
			echo "JOB FOUND \r\n";
			
			$jp_job = Job::where('wp_id' , $wp_id)->update($data);
						
			return $jp_job;
		}else{
			echo "CREATING JOB \r\n";
			
			$new_job = Job::create($data);;
			
			return $new_job;
		}*/
		
	}
	
	/**
     * Map wordpress array fields
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function map_array_fields($key){
		$str = '';
		
		switch($key){
			case 'job_levels' : $str = 'job_level_id'
			default : break;
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
	
}
