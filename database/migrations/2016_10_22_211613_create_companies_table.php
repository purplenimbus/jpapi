<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->increments('id');
			$table->string('name',100);
			$table->longText('description')->nullable();
			$table->integer('employee_num')->default(1);
			$table->integer('category_id')->default(1);
			$table->integer('location_id')->unsigned();
			$table->string('email');
			$table->string('phone');
			$table->string('logo')->nullable();
			$table->string('address')->nullable();
			$table->string('zipcode',10)->nullable();
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
        Schema::drop('companies');
    }
}
