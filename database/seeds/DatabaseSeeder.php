<?php

use App\User;
use App\Company;
use App\Company_Category;
use App\Job_Category;
use App\Job_Type;
use App\Job_Level;
use App\Job_Skill;
use App\Job;
use App\Salary;
use App\Location;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Goutte\Client;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Handler\CurlHandler;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
//use database\seeds\JobSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
	var	$company_cats;
	var	$salary_types;
	var $currencies;
	var $users;
	var $http;
	var $wordpress_url;
	
	function __construct(){
		$this->guzzle = new GuzzleHttp\Client();
		$this->wordpress_url = 'http://purplenimbus.net/jp/wp-json/wp/v2/';
		$this->currencies	=	[
			[
				"name"		=>	"Naira",
				"symbol"	=>	"NGN",
				"country"	=>	"Nigeria",
				"html"		=>	"&#x20A6;"
			],[
				"name"		=>	"US Dollar",
				"symbol"	=>	"USD",
				"country"	=>	"United States",
				"html"		=>	"&#x24;"
			],[
				"name"		=>	"GB Pounds",
				"symbol"	=>	"GBP",
				"country"	=>	"United Kingdom",
				"html"		=>	"&#xa3;"
			],[
				"name"		=>	"Cedis",
				"symbol"	=>	"GHS",
				"country"	=>	"Ghana",
				"html"		=>	"&#x20B5;"
			]
		];
		
		$this->salary_types	=	['Annually','Monthly','Daily','Hourly'];
		
		$this->company_cats	=	[	
									'Uncategorized','Basic Industries','Finance','Capital Goods','Healthcare','Consumer Durables',
									'Miscellaneous','Consumer','Non-Durables','Public Utilities','Consumer Services',
									'Technology','Energy','Transportation'
								];
		$this->job_levels	=	['Entry','Junior','Intermediate','Senior','Management','Senior Management'];
		
		$this->job_cats		=	[	'Uncategorized','Accounting','General Business',
									'Other','Admin & Clerical',
									'General Labor','Pharmaceutical',
									'Automotive','Government',
									'Professional Services',
									'Banking','Grocery',
									'Purchasing','Procurement',
									'Biotech', 'Health Care',
									'QA - Quality Control',
									'Broadcast','Journalism',
									'Hotel','Hospitality',
									'Real Estate','Business Developmeny',
									'Human Resources','Research',
									'Construction','Information Technology',
									'Restaurant','Food Service',
									'Consultant','Installation',
									'Maint','Repair','Retail',
									'Customer Service','Insurance',
									'Sales','Design',
									'Inventory','Science',
									'Distribution','Shipping',
									'Legal','Skilled Labor',
									'Trades','Education',
									'Teaching','Legal Admin',
									'Strategy','Planning',
									'Engineering','Management',	
									'Supply Chain','Entry Level',
									'New Grad','Manufacturing',	
									'Telecommunications','Executive',
									'Marketing','Training',
									'Facilities','Media ',
									'Journalism','Newspaper',
									'Transportation','Finance',
									'Nonprofit','Social Services',	
									'Warehouse','Franchise','Nursing',
								];
								
		$this->job_types	=	['Uncategorized','Full-Time','Part-Time','Contract','Freelance'];
		
		$this->job_skills	=	[	'Photoshop','Illustrator',
									'Dreamweaver','HTML','Javascript',
									'CSS','Angular JS','React JS','Microsoft Office',
									'Microsoft Word','Microsoft Excel','Microsoft Access',
									'ASP.Net','Java','PHP','Ruby','Django','Python'];
		$this->users		=	[
			[
				"fname"	=>	"Anthony",
				"lname"	=>	"Akpan",
				"email"	=>	"info@biosart.com.ng",
				"sex"	=>	"M",
				"dob"	=>	"2016-03-09",
				"password"	=>	"easier",
				"remember_token"	=>	str_random(10),
				"access_level"	=>	"admin",
				"username"	=>	"anthonyakpan"
			],[
				"fname"	=>	"Andem",
				"lname"	=>	"Emmanuel",
				"email"	=>	"andem.ewa@gmail.com",
				"sex"	=>	"M",
				"dob"	=>	"2016-03-09",
				"password"	=>	"aewa",
				"remember_token"	=>	str_random(10),
				"access_level"	=>	"admin",
				"username" => "andemewa"
			]
		];
	}
	
	private function WP($type,$endpoint,$payload){
		$url = $this->wordpress_url.$endpoint;
		
		$stack = $this->handler(env('CLIENT_KEY'),env('CLIENT_SECRET'),env('TOKEN_SECRET'),env('TOKEN'));

		$options = array( 	
							'form_params' => $payload ? $payload : null , 
							'handler' => $stack, 
							'auth' => 'oauth',
							'exceptions ' =>  false
						);
				
		$request = $this->guzzle->request($type,$url,$options)->send();
				
		return $request;
	}
	
	private function handler($consumer_key,$consumer_secret,$token_secret,$token){
		$handler = new CurlHandler();
		
		$stack = HandlerStack::create($handler);

		$middleware = new Oauth1([
			'consumer_key'    => $consumer_key,
			'consumer_secret' => $consumer_secret,
			'token_secret'    => $token_secret,
			'token'           => $token,
			'request_method' => Oauth1::REQUEST_METHOD_QUERY,
			'signature_method' => Oauth1::SIGNATURE_METHOD_HMAC
		]);
		
		$stack->push($middleware);
		
		return $stack;
	}
	
    public function import($type){
		switch($type){
			case 'users' : $this->loadUsers($this->users); break;
			case 'skills' : $this->loadSkills($this->users); break;
		}
	}
	
	private function loadUsers($users){
		foreach($users as $user){
			$new_user		=	new User;
			
			foreach($user as $key => $user_info){
				switch($key){
					case 'password' : $new_user['password'] = bcrypt($user_info); break;
					case 'username' : break;
					default : $new_user[$key]	=	strtolower($user_info);
				}
			}
			
			$data = array(
				'username'	 => $user['username'],
				'first_name' => $user['fname'],
				'last_name'	 => $user['lname'],
				'email'		 => $user['email'],
				'password'	 => $user['password'],
				'roles'		 => 'administrator'
			);
						
			//create WP user
			$user_id = $this->WP('post','users',$data);
			
			//bind WP user id to laravel
			echo $user_id->getBody();
			
			$new_user->save();
		}
	}
	
	private function loadSkills(){
		//get WP Tags
		$wp_tags = $this->WP('GET','tags',false);
		
		var_dump($wp_tags->getBody());
		/*
		foreach($wp_tags as $skill){
			$job_skills		=	new Job_Skill;
			$job_skills->tag	=	strtolower($skill->);
			
			$data = array(
				'name'	 => strtolower($skill),
			);
						
			
			
			//bind WP user id to laravel
			echo $user_id->getBody();
			
			if($user_id){
				$job_skills->save();
			}
			
		}
		*/
	}
	public function run()
    {
        // $this->call(UsersTableSeeder::class);
		//$this->import('users');
		$this->import('skills');
		
		/*
		//Populate Company Categories
		foreach($this->company_cats as $cat){
			$company_category		=	new Company_Category;
			$company_category->name	=	$cat;
			$company_category->save();
		}
		
		//Populate Job Levels
		foreach($this->job_levels as $level){
			$job_level			=	new Job_Level;
			$job_level->name	=	strtolower($level);
			$job_level->save();
		}
		//Populate Job Categories
		foreach($this->job_cats as $cat){
			$job_category		=	new Job_Category;
			$job_category->name	=	strtolower($cat);
			$job_category->save();
			
			$company_category		=	new Company_Category;
			$company_category->name	=	strtolower($cat);
			$company_category->save();
		}
		//Populate Job Type
		foreach($this->job_types as $type){
			$job_type		=	new Job_Type;
			$job_type->name	=	strtolower($type);
			$job_type->save();
		}
		
		//Populate Salary Type
		foreach($this->salary_types as $type){
			$salary_type		=	new Salary;
			$salary_type->name	=	strtolower($type);
			$salary_type->save();
		}
		
		//Populate Job Skills
		foreach($this->job_skills as $skill){
			$job_skills		=	new Job_Skill;
			$job_skills->tag	=	strtolower($skill);
			$job_skills->save();
		}
		
		//Create Some random Data
		factory(App\Company::class, 5)
			->create()
			->each(function ($u) {
                factory(App\Job::class,10)->create(['company_id' => $u->id]);
            });
		//Call Job Seeder
		//$this->call(JobSeeder::class);
		*/

    }
	
}
