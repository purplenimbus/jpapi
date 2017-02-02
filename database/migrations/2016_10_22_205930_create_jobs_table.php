<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->increments('id');
			$table->string('title',100);
			$table->longText('description');
			$table->integer('company_id')->default(1);
			$table->integer('job_category_id')->default(1);
			$table->integer('job_type_id')->default(1);
			$table->integer('job_level_id')->default(1);
			$table->integer('job_salary_id')->default(1);
			$table->integer('job_location_id')->default(1);
			$table->integer('job_class')->default(1); //Between Level 1 - 5 , level 5 being the best jobs
			$table->integer('salary');
			$table->integer('job_currency_id');
			$table->date('application_deadline')->nullable();
			$table->integer('min_experience')->default(1);
			$table->string('min_qualification')->default('none');
			$table->integer('job_ref_id')->nullable();
			$table->string('ref_url')->nullable();
			$table->date('ref_date')->nullable();
			$table->boolean('status')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('jobs');
    }
}
