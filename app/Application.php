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
	
	protected $visible = ['user_applied'];
}
