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
    public function update($wp_id,Request $request)
    {
        $requests = $request->all();
		
		$model_type = $request->jp_model;
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		echo "WP ID : ".$wp_id." , MODEL TYPE : ".$model_type." \r\n";
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		
		echo "JP MODEL OBJECT \r\n";
				
		$model = DB::table($model_type)
					->where('wp_id',$wp_id)
					->get();
		
		var_dump($model);
		
		echo "++++++++++++++++++++++++++++++++++++++++++++ \r\n";
		/*
		
		//
		
		//var_dump($requests);
		
		$model = DB::table($model_type)->get();
		
		return response()->json(['model_type' => $model_type],200);
		
		*/
    }
	
}
