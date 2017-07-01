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
		
		echo "WP ID : ".$wp_id." , ".$model_type." \r\n";
		
		/*
		
		//var_dump($model_type);
		
		//var_dump($requests);
		
		$model = DB::table($model_type)->get();*/
		
		return response()->json(['model_type' => $model_type],200);
    }
	
}
