<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\Company::class, function (Faker\Generator $faker) {
	$company = [
		'name' => $faker->company,
		'address' => $faker->streetAddress,
		'email' => $faker->safeEmail,
		'phone' => $faker->phoneNumber
    ];
	
	echo $company['name']."\r\n";
	
	return $company;
});

$factory->define(App\Job::class, function (Faker\Generator $faker) {
    $job = [
		'title' => $faker->jobTitle
    ];
	
	echo $job['title']."\r\n";
	
	return $job;
});
