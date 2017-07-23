<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
	protected $fillable = ['job_id','user_id'];
	
	protected $visible = ['created_at','user','job'];
	
	/**
     * Get the user associated with the application.
     */
    public function user()
    {
        return $this->belongsTo('App\User','user_id');
    }
	
	/**
     * Get the job associated with the application.
     */
    public function job()
    {
        return $this->belongsTo('App\Job','job_id');
    }
}
