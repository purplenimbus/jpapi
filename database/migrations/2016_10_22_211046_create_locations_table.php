<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->increments('id');
			$table->string('name')->nullable;
			$table->string('locality')->nullable;
			$table->string('city',50);
			$table->string('city_code',5)->nullable();
			$table->string('state',50);
			$table->string('state_code',5)->nullable();
			$table->string('country',20);
			$table->string('country_code',5)->nullable();
			$table->longText('description')->nullable();
			$table->decimal('long', 9, 6)->nullable();
			$table->decimal('lat', 9, 6)->nullable();
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
        Schema::drop('locations');
    }
}
