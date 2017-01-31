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
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
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
	
	
	function __construct(){
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
	}
	
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
		
		$user					=	new User;
		$user->fname			=	'Anthony';
		$user->lname			=	'Akpan';
		$user->email			=	'anthony.akpan@hotmail.com';
		$user->sex				=	'M';
		$user->dob				=	'2016-03-09';
		$user->password			=	bcrypt('easier');
		$user->remember_token	=	str_random(10);
		$user->access_level		=	'admin';
		
		$user->save();
		
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
			$job_skills->name	=	strtolower($skill);
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

    }
	
}
