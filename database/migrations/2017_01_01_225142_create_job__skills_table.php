<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobSkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job__skills', function (Blueprint $table) {
            $table->increments('id');
			$table->string('tag');
			$table->longText('description')->nullable();
			$table->string('image')->nullable();
			$table->integer('wp_id')->unique()->nullable();
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
        Schema::drop('job__skills');
    }
}
