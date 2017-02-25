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
			$table->integer('company_category_id')->default(1);
			$table->integer('company_location_id')->unsigned()->nullable();
			$table->string('email')->nullable();
			$table->string('phone')->nullable();
			$table->string('logo')->nullable();
			$table->string('address')->nullable();
			$table->string('zipcode',10)->nullable();
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
        Schema::drop('companies');
    }
}
