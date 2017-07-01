<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Model;

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
        $requests = $request->all();
		
		$model_type = $request->jp_model;
		
		$wp_id 		= $request->wp_id;
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		echo "WP ID : ".$id." , MODEL TYPE : ".$model_type." , WORDPRESS ID : ".$wp_id." \r\n";
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		echo "JP MODEL OBJECT \r\n";
				
		$model = DB::table($model_type)
					->where('wp_id',$wp_id)
					->get();
					
		foreach($requests as $key => $req){
			if($request->has($key)){
				echo "key : ".$key."\r\n";
				echo "Value Type : ".gettype($request[$key])."\r\n";
				echo "------------------------------------------------";
				
				switch(gettype($request[$key])){
					case 'array' : 
						echo "ARRAY ++++++++++++++++++++++++++++++++++++++++++++ \r\n";
						var_dump($request[$key]);
						break;
					
					default : 
						echo "STRING  : ".$request[$key]." \r\n";
						break;
				}
			}
		}
		
		//var_dump($model);
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		/*
		
		//
		
		//var_dump($requests);
		
		$model = DB::table($model_type)->get();
		
		return response()->json(['model_type' => $model_type],200);
		
		*/
    }
	
}
