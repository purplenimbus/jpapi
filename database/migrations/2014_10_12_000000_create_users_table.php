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
			$table->string('displayName');
			$table->date('dob');
			$table->char('sex',1);
            $table->string('email')->unique();
            $table->string('password');
			$table->string('access_level')->default('user');
			$table->integer('location_id')->nullable();
			$table->string('skills_id')->nullable();
			$table->integer('company_id')->nullable();
			$table->integer('linkedin')->nullable();
			$table->integer('wp_id')->nullable();
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
