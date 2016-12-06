<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Job_Category extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','description'
    ];
	
	//Bind Job Category to Job Model
	public function jobs(){
		return $this->hasMany('App\Job');
	}
}
