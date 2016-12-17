<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','description','address','location_id','email','phone','logo','company_category_id'
    ];
	
	protected $visible = [
        'name','description','address','location','email','phone','logo','company_category'
    ];
	
	//Get all jobs from this company
	public function jobs(){
		return $this->hasMany('App\Job');
	}
	
	//Get all jobs from this company
	public function category(){
		return $this->hasMany('App\Company_Category');
	}
}
