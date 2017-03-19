<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Job_Level extends Model
{
    //
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','description','wp_id'
    ];
	/**
     * The attributes that are visible to the client;
     *
     * @var array
     */
	protected $visible = [
        'id','name','description'
    ];
	
	//Bind Job Level to Job Model
	public function jobs(){
		return $this->hasMany('App\Job');
	}
}
