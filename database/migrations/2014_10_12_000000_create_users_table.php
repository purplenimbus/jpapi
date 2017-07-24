<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('fname');
			$table->string('lname');
			//$table->string('displayName')->nullable();
			$table->date('dob')->nullable();
			$table->char('sex',1)->nullable();
            $table->string('email')->unique();
            $table->string('password')->nullable();
			$table->string('access_level')->default('user');
			$table->integer('location_id')->nullable();
			$table->string('skills')->nullable();
			$table->integer('company_id')->nullable();
			$table->string('linkedin')->nullable();
			$table->string('image_url')->nullable();
			$table->integer('wp_id')->unique()->nullable();
            $table->rememberToken();
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
        Schema::drop('users');
    }
}
