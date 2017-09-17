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
        'name','description','address','zipcode','company_location_id','email','phone','logo','company_category_id','wp_id'
    ];
	
	protected $visible = [
        'id','name','description','address','zipcode','company_location_id','email','phone','logo','company_category','company_category_id','jobs','location','created_at','jobs'
    ];
	
	//Get all jobs from this company
	public function jobs(){
		return $this->hasMany('App\Job','company_id','id');
	}
	
	//Get all jobs from this company
	public function category(){
		return $this->belongsTo('App\Company_Category','company_category_id','wp_id');
	}
	
	//Bind Job to Location
	public function location(){
		return $this->belongsTo('App\Location','company_location_id','id');
	}
}
