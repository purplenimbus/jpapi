<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
		'description',
		'company_id',
		'salary_id',
		'location_id',
		'type_id',
		'level_id',
		'application_deadline',
		'min_experience',
		'min_qualification',
		'salary',
		'currency_id',
		'status',
		'ref_id',
		'ref_job_id',
		'ref_url'
    ];
	//Bind Job to Company
	public function company(){
		return $this->belongsTo('App\Company');
	}
	//Bind Job to Location
	public function location(){
		return $this->belongsTo('App\Location');
	}
	//Bind Job to Job Category
	public function job_category(){
		return $this->belongsTo('App\Job_Category');
	}
	//Bind Job to Job Type
	public function job_type(){
		return $this->belongsTo('App\Job_Type');
	}
	//Bind Job to Salary
	public function salary(){
		return $this->belongsTo('App\Salary');
	}
}
