<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Job_Type extends Model
{
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
	protected  $fillable	=	['name','description','wp_id'];
	/**
     * The attributes that are visible to the client;
     *
     * @var array
     */
	protected $visible = [
        'id','name','description'
    ];
	
	//Get all Jobs from Location
	public function jobs(){
		return $this->hasMany('App\Job');
	}
}
