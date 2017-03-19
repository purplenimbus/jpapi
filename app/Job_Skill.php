<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Job_Skill extends Model
{
	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id','tag','description','wp_id'
    ];
	
	/**
     * The attributes that are visible to the client;
     *
     * @var array
     */
	protected $visible = [
        'id','tag','description'
    ];
	
	/**
     * Get users that match a certain skill 
     *
     * @var array
     */
	 
	/**
     * Get jobs that match certain skills
     *
     * @var array
     */
}
