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
use MongoDB\Client as Mongo;
use MongoDB\BSON\ObjectID as MongoID;
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
	var $mongo;
	
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
				//"displayName"	=>	"anthonyakpan",
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
				//"displayName"	=>	"andemewa",
				"email"	=>	"andem.ewa@gmail.com",
				"sex"	=>	"M",
				"dob"	=>	"2016-03-09",
				"password"	=>	"aewa",
				"remember_token"	=>	str_random(10),
				"access_level"	=>	"admin",
				"username" => "andemewa"
			]
		];
		
		$this->mongo = new Mongo(env('MONGOURI', false));
	}
	
	public function WP($type,$endpoint,$payload){
		$url = $this->wordpress_url.$endpoint;
		
		$stack = $this->handler(env('CLIENT_KEY'),env('CLIENT_SECRET'),env('TOKEN_SECRET'),env('TOKEN'));

		$options = array( 	
							'form_params' => $payload ? $payload : null , 
							'handler' => $stack, 
							'auth' => 'oauth',
							'exceptions ' =>  false,
							'query' => [	'per_page' => 100	 ]
						);
				
		$response = $this->guzzle->request($type,$url,$options);
		
		if ($response->getStatusCode() == 200 ) {
			
			$wp_total_pages = $response->hasHeader('X-WP-TotalPages') ? $response->getHeader('X-WP-TotalPages')[0] : 1;
			
			$wp_data = [];
						
			$response = $response->getBody() ? json_decode((string)$response->getBody(),true) : [];
			
			//Merge first page data
			foreach($response as $value){
				array_push($wp_data,$value);
			}
						
			echo 'Total '.$endpoint.' Pages: '.$wp_total_pages."\r\n";
				
			//if more than one page
			if($wp_total_pages > 1){
				//loop through pages
				for($current_page = 2; $current_page < $wp_total_pages; $current_page++){
					echo 'Current '.$endpoint.' Page: '.$current_page."\r\n";
					
					//get page data
					$options['query']['page'] = $current_page;
					
					$response = $this->guzzle->request($type,$url,$options);
					//merge new response with $wp_data
					$response = json_decode((string)$response->getBody(),true);
					
					foreach($response as $value){
						array_push($wp_data,$value);
					};
				}
				
				return (object)$wp_data;
				
			}else{
				return $response;
			}
			
		}
		
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
				/*'username'	 => $user['username'],
				'first_name' => $user['fname'],
				'last_name'	 => $user['lname'],
				'email'		 => $user['email'],
				'password'	 => $user['password'],
				'roles'		 => 'administrator'*/
				
			);
						
			//create WP user
			//$user_id = $this->WP('post','users',$data);
			
			$new_user->save();
			
			$id = new MongoID();
			
			$data['_id'] 	 = $id;
			
			$data['user_id'] = $new_user->id;
						
			$db = $this->mongo->users->profiles;
			
			//Save User Details to mongo	
			//check mongo for user
			$user = $db->findOne([ 'user_id' => (int)$new_user->id ]);
			
			//create if user dosent exist
			if(!$user){
				echo 'no user found in mongo with id:'.$new_user->id."\r\n";
				isset($db) ? $db->insertOne($data) : null;
			}else{
				echo 'user found in mongo with id:'.$new_user->id."\r\n";
				
				continue;
				//isset($db) ? $user = $db->findAndModify($data,true) : null;
			}
			
			
			echo 'Mongo Saved!';
			
			echo 'ID: '.$id.( next($users) ? ' , ' : '' );
		}
	}
	
	private function loadSkills(){
		
		echo 'Job Skills'."\r\n";
		
		$wp_tags = $this->WP('GET','tags',false);
								
		foreach($wp_tags as $skill){
			$job_skills		=	new Job_Skill;
			
			$job_skills->tag	=	strtolower($skill['name']);
			
			$job_skills->description	=	$skill['description'];
			
			$job_skills->wp_id	=	$skill['id'];
							
			$job_skills->save();
			
			echo 'id: '.$skill['id'].', name : '.$skill['name']."\r\n";
		}
		
	}
	
	private function loadJobCategories(){
		
		echo 'Job Categories'."\r\n";
		
		$wp_cats = $this->WP('GET','categories',false);
								
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
	
	private function loadJobTypes(){
		
		echo 'Job Types'."\r\n";
		
		$wp_cats = $this->WP('GET','job_types',false);
								
		foreach($wp_cats as $cat){
			$job_type		=	new Job_Type;
			$job_type->name	=	strtolower($cat['name']);
			$job_type->description	=	$cat['description'];
			$job_type->wp_id	=	$cat['id'];
			$job_type->save();
			
			echo 'id: '.$cat['id'].', name : '.$cat['name']."\r\n";
		}
		
	}
	
	private function loadJobLevels(){
		
		echo 'Job Levels'."\r\n";
		
		$wp_cats = $this->WP('GET','job_levels',false);
								
		foreach($wp_cats as $cat){
			$job_type		=	new Job_Level;
			$job_type->name	=	strtolower($cat['name']);
			$job_type->description	=	$cat['description'];
			$job_type->wp_id	=	$cat['id'];
			$job_type->save();
			
			echo 'id: '.$cat['id'].', name : '.$cat['name']."\r\n";
		}
	
	}
	
	private function loadSalaryTypes(){
		echo 'Salary Types'."\r\n";
		
		$wp_cats = $this->WP('GET','salary_types',false);
		
		foreach($wp_cats as $cat){
			
			$job_type		=	new Salary;
			$job_type->name	=	strtolower($cat['name']);
			$job_type->description	=	$cat['description'];
			$job_type->wp_id	=	$cat['id'];
			$job_type->save();
			
			echo 'id: '.$cat['id'].', name : '.$cat['name']."\r\n";
		}
		
	}
	
	private function getJobs(){
		echo 'Get Jobs'."\r\n";
		
		$wp_jobs = $this->WP('GET','jobs',false);
											
		foreach($wp_jobs as $wp_job){
						
			if(strtolower($wp_job['status']) == 'publish'){
				$job = new Job;
				$job->title = $wp_job['title'] ? $wp_job['title']['rendered'] : null;
				$job->description = $wp_job['content'] ? $wp_job['content']['rendered'] : null;
								
				isset($wp_job['job_types']) ? 
					$job->job_type_id = implode(',',$wp_job['job_types']) 
				: null;
				
				isset($wp_job['job_levels']) ?
					$job->job_level_id =  implode(',',$wp_job['job_levels']) 
				: null;
				
				$wp_job['categories'] ?
					$job->job_category_id = implode(',',$wp_job['categories']) 
				: null;
				
				$wp_job['salary_types'] ?
					$job->job_salary_id =  implode(',',$wp_job['salary_types']) 
				: null;
				
				$job = $this->parse_wp_meta($wp_job['meta'],$job);
				
				isset($wp_job['meta']['wp_company_id']) ?
					$job->company_id =  $this->get_jp_resource_id($wp_job['meta']['wp_company_id'],'Company')
				: null;
				
				
				$job->status = true;
				
				$job->wp_id	=	$wp_job['id'];
				
				$job->save();
				
				echo $wp_job['title']['rendered']."\r\n";
				
				
												
			}
		
		}
		
	}
	
	private function getCompanies(){
		echo 'Companies'."\r\n";
		
		$wp_companies = $this->WP('GET','companies',false);

		foreach($wp_companies as $wp_company){
			if(strtolower($wp_company['status']) == 'publish'){
				$company		=	new Company;
				
				isset($wp_company['title']['rendered']) ?
					$company->name	=	strtolower($wp_company['title']['rendered'])
				: null;
				
				isset($wp_company['content']['rendered']) ?
					$company->description	=	$wp_company['content']['rendered']
				: null;
				
				isset($wp_company['categories'])?
					$company->company_category_id	=	implode(',',$wp_company['categories'])
				: null;
				
				$company = $this->parse_wp_meta($wp_company['meta'],$company);
				
				isset($wp_company['meta']['location_id'][0])?
					$company->company_location_id	=	$wp_company['meta']['location_id'][0]
				: null;
				
				isset($wp_company['meta']['logo_url'])?
					$company->logo	=	$wp_company['meta']['logo_url']
				: null;
				
				$company->status	=	true;
				
				$company->wp_id	=	$wp_company['id'];
				
				$company->save();
				
				echo 'id: '.$company['id'].', name : '.$company['name']."\r\n";
			}
		}

	}
	
	public function run(){
		$this->import('users');
		$this->import('skills');
		$this->import('job_categories');
		$this->import('job_types');
		$this->import('job_levels');
		$this->import('salary_types');
		$this->import('companies');
		$this->import('jobs');
		//$this->call(JobSeeder::class);
    }
	
	/**
     * Parse request for valid data
     *
     * @param  araay  $requests - Incoming requests to be prsed
     * @param  array $array  required fields to return from request
     * @return \Illuminate\Http\Response
     */
	
	public function parse_request($requests,$array){
						
		foreach($requests as $key => $req){
			if(array_search($key,$array) === false){
				unset($requests[$key]);
			}
		}
		
		return $requests;
	}
	
	/**
     * Parse location array and map keys to jp location model
     *
     * @param  araay  $requests - Incoming requests to be prsed
     * @return $parsed
     */
	public function parse_location($requests){
						
		foreach($requests as $key => $req){
			switch($key){
				case 'political ' : $requests['locality'] = $requests['political']; break;
				case 'locality' : $requests['city'] = $requests['locality']; break;
				case 'administrative_area_level_1' : $requests['state'] = $requests['administrative_area_level_1']; break;
				case 'postal_code' : $requests['zip_code'] = $requests['postal_code']; break;
				default: continue;
			}
		}
		
		return $requests;
	}
	
	
	/**
     * Get jp model id based on wp id
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function get_jp_resource_id($wp_id,$model){
		
		$model_name = "App\\".$model;
		
		try{
			
			$resource_id = $model_name::where('wp_id', $wp_id)->value('id');
			
			echo "resource_id:".$resource_id." \r\n";
			
			if($resource_id){
				return $resource_id;
			}else{
				return false;
			};
			
				
		}catch(Exception $e) {
			return $e->getMessage();
		}
		
	}
	
	/**
     *	Parse WP Meta Fields
     *
     * @param  array $wp_meta
     * @param  array $model
     * @return array $data
     */
	public function parse_wp_meta($wp_meta,$model){
						

		foreach($wp_meta as $key => $meta){
			
			isset($model->$key) ? 
				$model->$key = $wp_meta[$key][0]
			: null;	

		}
		
		return $model;

	}
	
	/**
     *	Parse Linkedin user profile
     *
     * @param  array $data
     * @return array $parsed
     */
	public function parse_user_profile($data){
						
		$parsed = 	[ 
						'education' => [],
						'experience' => [],
					];
					
		foreach($data as $data_key => $data_value){
			
			switch($data_key){
				case 'positions'	: 	foreach($data[$data_key]['values'] as $key => $value){
											array_push($parsed['experience'],[ 
												'job_title' => isset($value['title']) ? $value['title'] : '',
												'company' => isset($value['company']['name']) ? $value['company']['name'] : '',
												'location' => isset($value['location']) ? $value['location']['name'] : '',
												'is_current' => isset($value['isCurrent']) ? $value['isCurrent'] : '',
												'dates' => [ 
													'start' => isset($value['startDate']) ? date($value['startDate']) : '', 
													'end' => isset($value['endDate']) ? date($value['endDate']) : '',
												]
											]);
										}; break;
				
				//add more profile fields here
				
				default : continue; break;
			}
		}
		
		return $parsed;

	}
	
	/**
     *	Parse Linkedin user profile
     *
     * @param  array $data
     * @return array $id
     */
	public function save_profile($profile_data,$id){
						
		$profile = $this->mongo->users->profiles->updateOne(
			['user_id' 	=> (int)$id ],
			['$set' 	=> ['resume' => json_encode($profile_data) ] ]
		);

		return $profile;
	}
}
