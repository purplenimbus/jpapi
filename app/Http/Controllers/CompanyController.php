<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use	App\Job;
use	App\Company;
use	App\Company_Category;


class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {		
		$companies	=	Company::all();
		
		foreach($companies as $company){
			$company['company_cat'] = $company->category;
		}
		
		return $companies->toJson();
    }
	
	/**
     * Return a list of company options i.e company category
     *
     * @return \Illuminate\Http\Response
     */
    public function companyoptions()
    {
		$company_types = [
			"company_cats" => Company_Category::all()->sortBy('name')
		];
		
		return json_encode($company_types);
	}
	
	/**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $company	=	Company::findorfail($id);
		
		$company['jobs']		= 	$company->jobs;
		$company['company_category']	= 	$company->category;
		
		//echo $company['jobs'][0];
				
		return json_encode($company);
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
		$company		=	Company::findorfail($id);
		
		$requests	=	$request->all();
		
		foreach($requests as $key => $req){
			if($request->has($key)){
				$company[$key]	=  $request->input($key);
				//echo $request->input($key);
			}
		}
		
		$company->save();
		
		$payload = json_encode($requests);
		
		return json_encode((object)['id'	=>	$company->id , 'payload'	=>	$payload ]);		
    }
}
