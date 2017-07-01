<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;

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
		
		$model_type = $requests['jp_model'];
		
		var_dump($model_type);
		
		echo "WP ID : ".$wp_id." , ".$model_type." \r\n";
		
		var_dump($requests);
    }
	
}
