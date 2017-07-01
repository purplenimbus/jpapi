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
		
		echo "WP ID : ".$wp_id." , ".$requests->jp_model." \r\n";
		
		var_dump($requests);
    }
	
}
