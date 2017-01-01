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

		return $companies->toJson();
    }
	
	/**
     * Return a list of company options i.e company category
     *
     * @return \Illuminate\Http\Response
     */
    public function companyoptions()
    {
		$company_types = Company_Category::all()->sortBy('name');
		
		return $company_types->toJson();
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
		
		$company['jobs']			= isset($company->jobs) ? $company->jobs : '';
		//unset($job['company']['']);
		
		return $company->toJson();
    }
}
