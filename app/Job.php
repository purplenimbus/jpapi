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
		'job_company_id',
		'job_salary_id',
		'job_location_id',
		'job_type_id',
		'job_category_id',
		'job_level_id',
		'application_deadline',
		'min_experience',
		'min_qualification',
		'salary',
		'job_currency_id',
		'status',
		'job_ref_id',
		'ref_url',
		'skills',
		'wp_id'
    ];

	
	protected $visible = [
		'id',
        'title',
		'description',
		'company',
		'salary',
		'job_salary_id',
		'job_category',
		'job_type',
		'job_level',
		'application_deadline',
		'min_experience',
		'min_qualification',
		'skills',
		'salary',
		'salary_type',
		'status',
		'job_ref_id',
		'ref_url',
		'location',
		'job_location_id',
		'updated_at',
		'created_at',
		'user_applied',
		'job_skills',
		'wp_id'
    ];
	
	/* Relationships */
	//Bind Job to Company
	public function company(){
		return $this->belongsTo('App\Company');
	}
	//Bind Job to Location
	public function location(){
		return $this->belongsTo('App\Location','job_location_id');
	}
	//Bind Job to Job Category
	public function job_category(){
		return $this->belongsTo('App\Job_Category','job_category_id','wp_id');
	}
	//Bind Job to Job Type
	public function job_type(){
		return $this->belongsTo('App\Job_Type','job_type_id','wp_id');
	}
	//Bind Job to Job Level
	public function job_level(){
		return $this->belongsTo('App\Job_Level','job_level_id','wp_id');
	}
	//Bind Job to SKills
	public function job_skills(){
		return $this->belongsTo('App\Job_Skill','job_salary_id','wp_id');
	}
}
