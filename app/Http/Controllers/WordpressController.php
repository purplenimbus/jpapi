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

use DatabaseSeeder as Seeder;

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
		$this->seeder = New Seeder;
    }
	/**
     * Store wordpress resources
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update($id,Request $request)
    {				
		
		//echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		//echo "WP ID : ".$id." , MODEL TYPE : ".$model_type." , WORDPRESS ID : ".$request->wp_id." \r\n";
		
		//echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		$data = $this->jp_model($request,$request->jp_model);
		
		//echo "++++++++++++++++++ WP DATA +++++++++++++++++++++ \r\n";
				
		//var_dump($data);
		
		//echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";

		return response()->json(['id' => $data->id , 'location_id' => isset($data->location->id) ? $data->location->id : null ],200);

    }
	
	/**
     * Create Model
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $model
     * @return \Illuminate\Http\Response
     */
    public function jp_model($request,$model){
		
		$model_name = "App\\".$model;
		
		try{
			$sample_model = new $model_name;

			$data = $this->seeder->parse_request($request->all(),$sample_model->getFillable());
			
			echo "++++++++++++++++++ ".$model_name." MODEL INCOMING PARSED DATA +++++++++++++++++++++ \r\n";
			
			var_dump($data);
			
			//get jpApi company id
			if (null !== $request->has('wp_company_id')) {
				$data['company_id'] = $this->get_jp_resource_id($request->wp_company_id,'Company');
			}
						
			//var_dump($request->input('location.ref_id'));
								
			$resource = $model_name::updateOrCreate(['wp_id' => $request->wp_id],$data);
			
			//var_dump(isset($resource->location));
			
			//save location details
			if(isset($resource->location) && $request->has('location')){
				
				//echo "Resource has location \r\n";
				
				$sample_location = new Location;
				
				$loc_data = $this->seeder->parse_location(json_decode($request->input('location'),true));
				
				echo "location data \r\n";
				
				var_dump($loc_data);
				
				$parsed_loc_data = $this->seeder->parse_request($loc_data,$sample_location->getFillable());
				
				echo "Parsed location \r\n";
				
				var_dump($parsed_loc_data);
								
				$location = Location::updateOrCreate(['ref_id' => $loc_data['ref_id']],$parsed_loc_data);
				
				echo "Resource location FK:".strtolower($request->jp_model)."_location_id:".$location->id." \r\n";
				
				var_dump($location);
								
				$resource[strtolower($request->jp_model).'_location_id'] = $location->id;
				
				$resource->save();
				
			}

								
			return $resource;

		}catch(Exception $e) {
			return $e->getMessage();
		}

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
						
			if(isset($resource->id)){
				return $resource->id;
			}else{
				return false;
			};
			
				
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
	
}
