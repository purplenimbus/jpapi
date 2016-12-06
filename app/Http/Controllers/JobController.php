<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use	App\Job;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {		
		return view('layouts.pages.jobs', [ 'page_title' => 'Jobs' 
											//'jobs' => Job::all()
											]);
    }
	
	public function getJobs()
    {		
		return 'Job';//Job::find(1);
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
		
		return view('layouts.pages.jobs.view-job', [ 
													'page_title' => $job->title , 
													'job' => $job
													]);
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
				$job[$key]	=	$request[$key];
			}
		}
		
		$job->save();
		
		return json_encode((object)['id'	=>	$job->id ]);		
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
}
