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
				"displayName"	=>	"anthonyakpan",
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
				"displayName"	=>	"andemewa",
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
	
	public function WP($type,$endpoint,$payload){
		$url = $this->wordpress_url.$endpoint;
		
		$stack = $this->handler(env('CLIENT_KEY'),env('CLIENT_SECRET'),env('TOKEN_SECRET'),env('TOKEN'));

		$options = array( 	
							'form_params' => $payload ? $payload : null , 
							'handler' => $stack, 
							'auth' => 'oauth',
							'exceptions ' =>  false
						);
				
		$request = $this->guzzle->request($type,$url,$options);
				
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
			case 'skills' : $this->loadSkills(); break;
			case 'job_categories' : $this->loadJobCategories(); break;
			case 'job_types' : $this->loadJobTypes(); break;
			case 'job_levels' : $this->loadJobLevels(); break;
			case 'salary_types' : $this->loadSalaryTypes(); break;
			case 'companies' : $this->getCompanies(); break;
			default : $this->getJobs(); break;
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
			//$user_id = $this->WP('post','users',$data);
			
			$new_user->save();
		}
	}
	
	private function loadSkills(){
		
		echo 'Job Skills'."\r\n";
		
		$response = $this->WP('GET','tags',false);
		
		$wp_tags = json_decode((string)$response->getBody(),true);
						
		if($response->getStatusCode() == 200){
			foreach($wp_tags as $skill){
				$job_skills		=	new Job_Skill;
				
				$job_skills->tag	=	strtolower($skill['name']);
				
				$job_skills->description	=	$skill['description'];
				
				$job_skills->wp_id	=	$skill['id'];
								
				$job_skills->save();
				
				echo 'id: '.$skill['id'].', name : '.$skill['name']."\r\n";
			}
		}
		
	}
	
	private function loadJobCategories(){
		
		echo 'Job Categories'."\r\n";
		
		$response = $this->WP('GET','categories',false);
		
		$wp_cats = json_decode((string)$response->getBody(),true);
						
		if($response->getStatusCode() == 200){
			foreach($wp_cats as $cat){
				$job_category		=	new Job_Category;
				$job_category->name	=	strtolower($cat['name']);
				$job_category->description	=	$cat['description'];
				$job_category->wp_id	=	$cat['id'];
				$job_category->save();
				
				$company_category		=	new Company_Category;
				$company_category->name	=	strtolower($cat['name']);
				$company_category->description	=	$cat['description'];
				$company_category->wp_id	=	$cat['id'];
				$company_category->save();
				
				echo 'id: '.$cat['id'].', name : '.$cat['name']."\r\n";
			}
		}
		
	}
	
	private function loadJobTypes(){
		
		echo 'Job Types'."\r\n";
		
		$response = $this->WP('GET','job_types',false);
		
		$wp_cats = json_decode((string)$response->getBody(),true);
						
		if($response->getStatusCode() == 200){
			foreach($wp_cats as $cat){
				$job_type		=	new Job_Type;
				$job_type->name	=	strtolower($cat['name']);
				$job_type->description	=	$cat['description'];
				$job_type->wp_id	=	$cat['id'];
				$job_type->save();
				
				echo 'id: '.$cat['id'].', name : '.$cat['name']."\r\n";
			}
		}
		
	}
	
	private function loadJobLevels(){
		
		echo 'Job Levels'."\r\n";
		
		$response = $this->WP('GET','job_levels',false);
		
		$wp_cats = json_decode((string)$response->getBody(),true);
						
		if($response->getStatusCode() == 200){
			foreach($wp_cats as $cat){
				$job_type		=	new Job_Level;
				$job_type->name	=	strtolower($cat['name']);
				$job_type->description	=	$cat['description'];
				$job_type->wp_id	=	$cat['id'];
				$job_type->save();
				
				echo 'id: '.$cat['id'].', name : '.$cat['name']."\r\n";
			}
		}
		
	}
	
	private function loadSalaryTypes(){
		echo 'Salary Types'."\r\n";
		
		$response = $this->WP('GET','salary_types',false);
		
		$wp_cats = json_decode((string)$response->getBody(),true);
						
		if($response->getStatusCode() == 200){
			foreach($wp_cats as $cat){
				$job_type		=	new Salary;
				$job_type->name	=	strtolower($cat['name']);
				$job_type->description	=	$cat['description'];
				$job_type->wp_id	=	$cat['id'];
				$job_type->save();
				
				echo 'id: '.$cat['id'].', name : '.$cat['name']."\r\n";
			}
		}
		
	}
	
	private function getJobs(){
		echo 'Get Jobs'."\r\n";
		
		$response = $this->WP('GET','jobs',false);
		
		$wp_jobs = json_decode((string)$response->getBody());
					
		if($response->getStatusCode() == 200){
			foreach($wp_jobs as $wp_job){
				
				if(strtolower($wp_job->status) == 'publish'){
					$job = new Job;
					$job->title = $wp_job->title ? $wp_job->title->rendered : null;
					$job->description = $wp_job->content ? $wp_job->content->rendered : null;
					
					/*
					isset($wp_job->tags) ?
						$job->skills =  implode(',',$wp_job->tags) 
					: null;
					
					isset($wp_job->job_types) ? 
						$job->job_type_id = implode(',',$wp_job->job_types) 
					: null;
					
					isset($wp_job->job_levels) ?
						$job->job_level_id =  implode(',',$wp_job->job_levels) 
					: null;
					
					$wp_job->categories ?
						$job->job_category_id = implode(',',$wp_job->categories) 
					: null;
					
					$wp_job->salary_types ?
						$job->job_salary_id =  implode(',',$wp_job->salary_types) 
					: null;
					*/
					
					isset($wp_job->meta->application_deadline[0]) ?
						$job->application_deadline =  $wp_job->meta->application_deadline[0] 
					: null;
					
					isset($wp_job->meta->job_ref_id[0]) ? 
						$job->job_ref_id = $wp_job->meta->job_ref_id 
					: null;
					
					isset($wp_job->meta->ref_url[0]) ?
						$job->ref_url = $wp_job->meta->ref_url 
					: null;
					
					isset($wp_job->meta->ref_date[0]) ?
						$job->ref_date =  $wp_job->meta->ref_date 
					: null;
					
					isset($wp_job->meta->min_experience[0]) ?
						$job->min_experience =  $wp_job->meta->min_experience[0] 
					: null;
					
					isset($wp_job->meta->min_qualification[0]) ? 
						$job->min_qualification = $wp_job->meta->min_qualificationn 
					: null;
					
					isset($wp_job->meta->salary[0]) ? 
						$job->salary = $wp_job->meta->salary 
					: null;
					
					isset($wp_job->meta->location_id[0]) ? 
						$job->job_location_id = $wp_job->meta->location_id 
					: null;
					
					$job->status = true;
					
					$job->wp_id	=	$wp_job->id;
					
					$job->save();
					
					echo $wp_job->title->rendered."\r\n";;
				}
			}
		}
	}
	
	private function getCompanies(){
		echo 'Companies'."\r\n";
		
		$response = $this->WP('GET','companies',false);
		
		$wp_companies = json_decode((string)$response->getBody());
						
		if($response->getStatusCode() == 200){
			foreach($wp_companies as $wp_company){
				if(strtolower($wp_company->status) == 'publish'){
					$company		=	new Company;
					
					isset($wp_company->title->rendered) ?
						$company->name	=	strtolower($wp_company->title->rendered)
					: null;
					
					isset($wp_company->content->rendered) ?
						$company->description	=	$wp_company->content->rendered
					: null;
					
					isset($wp_company->categories)?
						$company->company_category_id	=	implode(',',$wp_company->categories)
					: null;
					
					isset($wp_company->meta->address[0])?
						$company->address	=	$wp_company->meta->address[0]
					: null;
					
					isset($wp_company->meta->location_id[0])?
						$company->company_location_id	=	$wp_company->meta->location_id[0]
					: null;
					
					isset($wp_company->meta->email[0])?
						$company->email	=	$wp_company->meta->email[0]
					: null;
					
					isset($wp_company->meta->phone[0])?
						$company->phone	=	$wp_company->meta->phone[0]
					: null;
					
					isset($wp_company->meta->logo_url)?
						$company->logo	=	$wp_company->meta->logo_url
					: null;
					
					$company->status	=	true;
					
					$company->wp_id	=	$wp_company->id;
					
					$company->save();
					
					echo 'id: '.$company->id.', name : '.$company->name."\r\n";
				}
			}
		}
	}
	
	public function run()
    {
		$this->import('users');
		$this->import('skills');
		$this->import('job_categories');
		$this->import('job_types');
		$this->import('job_levels');
		$this->import('salary_types');
		$this->import('jobs');
		$this->import('companies');
    }
	
}
