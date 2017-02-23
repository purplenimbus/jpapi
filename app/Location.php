<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id','name','locality','city','city_code','state','state_code','country','country_code','zip_code','lng','lat','ref_id','url'
    ];
	
	protected $visible = [
		'name','locality','city','state','country','zip_code','lng','lat','url'
    ];
	//Get all Jobs from Location
	public function jobs(){
		return $this->hasMany('App\Job','job_location_id');
	}
	//Get all Companies
	public function companies(){
		return $this->hasMany('App\Company');
	}
	//Get all Salaries
	public function salaries(){
		return $this->hasMany('App\Salary');
	}
}
