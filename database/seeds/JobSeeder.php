<?php

use Illuminate\Database\Seeder;
use App\Job;
use App\Job_Category;
use App\Job_Type;
use App\Job_Level;
use App\Company;
use App\Company_Category;
use GuzzleHttp\Client as Guzzle;
use Goutte\Client as Gouette;

class JobSeeder extends Seeder
{
    /**
     * JOB SEEDER
     * This class handles everything to do with scraping jobs from sources using YQL
     * Job Levels , Job Types and Job Categories are seeded as well
	 * METHODS
     * - getJobs(url,xpath) : Get jobs via a HTTP request to YQL using Guzzle
     * JOB SOURCES
     * Jobberman.com
     * Joblist.com
     *
     *
     *
     *
     *
     * @return void
     */
	
	var $sources;
	var	$client;
	var	$scraper;
	var $job_cats;
	var $job_types;
	var	$job_levels;
	var	$company_count;
	var	$job_count;
	var $job_cat_count;
	
	function __construct(){
		$this->company_count	=	0;
		$this->job_count		=	0;
		$this->job_cat_count	=	0;
		$this->sources	=	[
			/*(object)[
				"name"		=>	"joblist",
				"url"		=>	"http://joblistnigeria.com/page/1",
				"xpath"		=>	(object)[
									"title"			=>	"//div[@class=\"bank\"]//h3",
									"link_tag"		=>	"h3",
									"description"	=>	"//div[@class=\"entry-content single-detail\"]//p/text()[normalize-space()] | //h1 | //h2/a",
									"title_tag"		=>	"h1",
									
								]
			],*/(object)[
				"name"		=>	"jobberman",
				"url"		=>	"http://www.jobberman.com/",
				"xpath"		=>	(object)[
									"title"			=>	"//a[@class=\"job-title\"]",
									"link_tag"		=>	"a",
									"description"	=>	"//h1|//h2/a|//div[@class=\"job-details-main\"]//p/text()[normalize-space()]|//p[@class=\"job-details-sum-subhead\"]",
									"title_tag"		=>	"h1"
								]
			]/*,(object)[
				"name"		=>	"myjobmag",
				"url"		=>	"http://myjobmag.com/",
				"xpath"		=>	(object)[
									"title"			=>	"//li[@id=\"lists\"]//ul//li//a",
									"link_tag"		=>	"a",
									"description"	=>	"//li[@class=\"benefits3\"]//p[1]|//*[@itemprop]|//ul[@class=\"p_spantitle\"]",
									"title_tag"		=>	"h1"
								]
			]*/,(object)[
				"name"		=>	"smartrecruiters",
				"url"		=>	"https://jobs.smartrecruiters.com/?keyword=nigeria",
				"xpath"		=>	(object)[
									"title"			=>	"//li[@class=\"jobs-item\"]/a",
									"link_tag"		=>	"a",
									"description"	=>	"//header//img|//main//h1|//section[@class=\"job-section\"]|//*[@itemprop]",
									"title_tag"		=>	"h1"
								]
			]
		];
		
		$this->client 		= 	new Guzzle();
		
		$this->scraper		=	new	Gouette();
	}
	
    public function run()
    {
		$self = $this;
		
		//Loop through Job sources
		foreach($this->sources as $source){
			echo 'Job Source Name: '.$source->name."\r\n";

			if(isset($source->url)):
				
				if(isset($source->xpath)){
					echo "Xpath Available"."\r\n";
					$jobs	=	$this->getJobs($source->url,$source->xpath->title);
				}else{
					echo "No Xpath Available"."\r\n";
					$jobs	=	$this->client->get($source->url)->getBody()->getContents();
					
				}
				
				//$self->smartrecruiters($jobs,$source);
				
				//var_dump($self->{$source->name}($jobs,$source));
				
				//isset($this->{$source->name}($jobs,$source)) ? $this->{$source->name}($jobs,$source) : print_r("No Sources Available"."\r\n");
				
				
				switch($source->name){
					case 'jobberman' : return $this->jobberman($jobs,$source); break;
					case 'joblist'   : return $this->joblist($jobs,$source); break;
					case 'myjobmag'  : return $this->myjobmag($jobs,$source); break;
					case 'smartrecruiters'  : return $this->smartrecruiters($jobs,$source); break;
					default			 :	echo "No Sources Available"."\r\n";
				};
				
			else:	
				echo "No Source Url Found";
				continue;
			endif;
			
		}
		
		echo $this->job_count." Jobs Imported"."\r\n";
		echo $this->company_count." Companies Created"."\r\n";
		
    }
	
	private function getJobs($url,$xpath){		
		$url_encoded 	=	rawurlencode($url);
		
		if(isset($xpath)){
			$xpath_encoded	=	rawurlencode($xpath);
			$query	=	"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'".$url_encoded."'%20and%20xpath%3D'".$xpath_encoded."'&format=json&diagnostics=true&callback=";
		}else{
			$query	=	"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'".$url_encoded."'&format=json&diagnostics=true&callback=";
		}
			
		$res	=	$this->client->get($query);
		
		return json_decode($res->getBody()->getContents())->query->results;
	}
	
	//Add Job sources here
	private function jobberman($jobs,$source){
		$count = 0;
		
		foreach($jobs->{$source->xpath->link_tag} as $job){
			//if($count > 5){return false;}
			echo "Starting Jobs Loop"."\r\n";
			//var_dump($job);
			$ref_id		=	explode('/', parse_url($job->href,PHP_URL_PATH))[2];
			echo 'Job Ref ID: '.$ref_id."\r\n";
			if(!App\Job::where('job_ref_id',$ref_id)->first()){		
				
				if(isset($job->href)){
					$job_detail		=	$this->getJobs($job->href,$source->xpath->description);
					$job_title		=	trim(strtolower($job_detail->{$source->xpath->title_tag}));
					$company_name 	= 	trim(strtolower($job_detail->a->content));
					$job_type		=	trim(strtolower($job_detail->p[4]->a->content));
					
					//var_dump($job_detail->p);
					
					//Set Company
					if($company_name){
						//echo "Company Name ".$company_name."\r\n";
						$find_company = Company::where('name',$company_name)->first();
					
						if(isset($find_company->name)){
							echo "Company found ".$find_company->id."\r\n";
							$company_id	=	$find_company->id;
						}else{
							echo "Company not found , creating new company ".$company_name."\r\n";
							$new_company 		= 	new Company;
							$new_company->name	=	trim(strtolower($company_name));
							$new_company->save();
							$company_id			=	$new_company->id;
							$this->company_count++;
						}
					}
					
					//Set Job Type
					if($job_type){
						$job_type = str_replace("-"," ",$job_type);
						echo "Job Type ".$job_type."\r\n";
						$find_job = Job_Type::where('name',$job_type)->first();
						//var_dump($find_job);
						if(isset($find_job->name)){
							echo "Job Type found : ".$find_job->id."\r\n";
							$type_id	=	$find_job->type_id;
						}
						
						if(isset($job_detail->content)){
							$new_job				=	new Job;
							$new_job->title			=	$job_title;
							$new_job->description	=	$job_detail->content;
							$new_job->ref_url		=	$job->href;
							$new_job->job_ref_id	=	$ref_id;
							$new_job->company_id	=	$company_id;
							$new_job->job_type_id	=	($type_id) ? $type_id : 0;
							$new_job->save();
							$this->job_count++;
						}
					}
				}else{
					continue;
				}	
			}else{
				echo "Job ".$job_title."|".$ref_id." already exists"."\r\n";
				continue;
			}
			
			$count++;
			echo "======================================================================================"."\r\n";
		}
	}
	
	private function joblist($jobs,$source){
		foreach($jobs->h3 as $job){
			//Make calls to each url to get job
			
			if(isset($job->a->href)):
				$job_detail	=	$this->getJobs($job->a->href,$source->xpath->description);
				
				//var_dump($job_detail->content);
				
				if(isset($job_detail->content)){
					$jobNew					=	new Job;
					$jobNew->title			=	strtolower($job_detail->{$source->xpath->title_tag});
					$jobNew->description	=	$job_detail->content;
					//echo 'Job Title 		: '.$jobNew->title."\r\n";
					$jobNew->save();
				}
				
			endif;
		}
	}
	
	private function myjobmag($jobs,$source){
		//var_dump($jobs);
		//var_dump($source);
		$job_title		=	'';
		$job_url		=	'';
		$company_name	=	'';
		$company_cat	=	'';
		$ref_id			=	0;
		$count			=	1;
		
		//$this->scraper->getClient()->setDefaultOption(array("verify"=> false));
		
		foreach($jobs->{$source->xpath->link_tag} as $job){
			//var_dump($job);
			//if($count > 3){ return false; }; // Limit Iteration to 3
			
			$job_title		=	strtolower($job->content);
			$job_url		=	$source->url.$job->href;
			$job_type		=	'';
			$ref_id			=	explode('/', parse_url($job_url,PHP_URL_PATH))[2];
			$company_name	=	'';
			$company_desc	=	'';
			$job_location	=	'';
			$job_category	=	'';
			$jobs			=	[];
			
			if($job_url):
				$job_detail		=	$this->getJobs($job_url,$source->xpath->description);
				
				if($job_detail):
					//$company_name	=	$job_detail->p[0]->strong->b." ".$job_detail->p[0]->strong->content;

					//var_dump($job_detail->p[0]->content);
					
					//var_dump($job_detail->span);
					
					$company_name = isset($job_detail->a[0]->title) ? strtolower(trim($job_detail->a[0]->title)) : '';
					
					$company_desc	=	isset($job_detail->p[0]->content) ? $company_name." ".$job_detail->p[0]->content : '';
					
					$job_type = isset($job_detail->a[1]->content) ? strtolower(trim($job_detail->a[1]->content)) : '';
					
					$job_location	=	isset($job_detail->a[2]->content) ? strtolower(trim($job_detail->a[2]->content)) : '';
					
					$job_category	=	'';
					//Set Company
					if($company_name){
						//echo "Company Name ".$company_name."\r\n";
						$find_company = Company::where('name',$company_name)->first();
					
						if(isset($find_company->name)){
							echo "Company found ".$find_company->id."\r\n";
							$company_id	=	$find_company->id;
						}else{
							echo "Company not found , creating new company ".$company_name."\r\n";
							$new_company 		= 	new Company;
							$new_company->name	=	$company_name;
							$new_company->description	=	$company_desc;
							$new_company->save();
							$company_id			=	$new_company->id;
							$this->company_count++;
						}
					}
					//Set Job Category
					if($job_category){
						$find_job_cat	=	Job_Category::where('name',$job_category)->first();
						
						if(isset($find_job_cat->name)){
							echo "Job Category found ".$find_company->id."\r\n";
							$job_cat_id	=	$find_company->id;
						}else{
							echo "Job Category not found , creating new job category ".$job_category."\r\n";
							$new_job_cat 		= 	new Job_Category;
							$new_job_cat->name	=	$job_category;
							$new_job_cat->save();
							$job_cat_id		=	$new_job_cat->id;
							$this->job_cat_count++;
						}
					}
					//Set Job Type
					
					
					//var_dump($ref_id);
					echo "Job Title : ".$job_title."\r\n";
					echo "Job Url : ".$job_url."\r\n";
					echo "Job Location : ".$job_location."\r\n";
					echo "Job Type : ".$job_type."\r\n";
					echo "Ref Id  : ".$ref_id."\r\n";
					echo "Company  : ".$company_name."\r\n";
					echo "Company Description  : ".$company_desc."\r\n";
					echo "-------------------------------------------------------------------------------------------------------"."\r\n";
					
					$count++;
				else:
				echo "No Job Details Found";
					
					return true;
				endif;
			else:
				echo "No Job Url Found";
				
				return true;
			endif;
		}
	}
	
	private function smartrecruiters($jobs,$source){
		
		$job_title		=	'';
		$job_description		=	'';
		$job_location		=	'';
		$job_qualifications		=	'';
		$company_name	=	'';
		$company_cat	=	'';
		$company_cat_id	=	0;
		$company_logo	=	'';
		$company_description	=	'';
		$ref_id			=	0;
		//$ref_date			=;
		$ref_url			=	'';
		$application_deadline	=	0;
		$count			=	1;
		$self			=	$this;
		
		foreach($jobs->a as $job){
			if($count > 3){ return false; }; // Limit Iteration to 3
			$ref_url	=	$job->href;
			//var_dump($job);
			if($ref_url){
				$job_detail	=	$self->getJobs($ref_url,$source->xpath->description);
				var_dump($job_detail);
				if($job_detail){
					$company_name	=	$job_detail->img->alt;
					$company_logo	=	$job_detail->img->src;
					//$company_description	=	$job_detail->section[0]->div->p;
					$job_title =	$job_detail->h1->content;
					$job_description =	implode($job_detail->section[1]->div->p);
					$job_qualifications =	implode($job_detail->section[2]->div->p);
					$ref_date	=	date($job_detail->meta[2]->content);
					$company_type	=	$job_detail->meta[3]->content;
					echo 'Company Description';
					var_dump($company_description);
					echo 'Company Name';
					var_dump($company_name);
				
					//Set Company
					if($company_name){
						//echo "Company Name ".$company_name."\r\n";
						$find_company = Company::where('name',$company_name)->first();
					
						if(isset($find_company->name)){
							echo "Company found ".$find_company->id."\r\n";
							$company_id	=	$find_company->id;
						}else{
							echo "Company not found , creating new company ".$company_name."\r\n";
							$new_company 		= 	new Company;
							$new_company->name	=	trim(strtolower($company_name));
							$new_company->description	=	trim($company_description);
							$new_company->logo	=	$company_logo;
							//Set Company Categories
							if($company_type){
								$find_company_cat = Company_Category::where('name',$company_type)->first();
								if(isset($find_company_cat->name)){
									echo "Company Category found ".$find_company_cat->id."\r\n";
									$company_cat_id	=	$find_company_cat->id;
								}else{
									echo "Company Category not found , creating new company category ".$company_type."\r\n";
									$new_company_cat 		= 	new Company_Category;
									$new_company_cat->name	=	trim(strtolower($company_type));
									$new_company_cat->save();
									$new_company->category_id	=	$new_company_cat->id;
									echo 'Company Category ID: '.$company_cat_id;
								}
							}
							$new_company->save();
							$company_id			=	$new_company->id;
							
							echo "Company Name : ".$company_name."\r\n";
							echo "Company Logo : ".$company_logo."\r\n";
							echo "Company Description : ".$company_description."\r\n";
							echo "Company ID : ".$company_id."\r\n";
							echo "Company Category ID : ".$company_cat_id."\r\n";
							echo "Company Type : ".$company_type."\r\n";
							echo "Job Title : ".$job_title."\r\n";
							echo "Job Description : ".$job_description."\r\n";
							echo "Job Qualifications : ".$job_qualifications."\r\n";
							echo "Job Url : ".$ref_url."\r\n";
							echo "Job Post Date : ".$ref_date."\r\n";
							echo "========================================================================================="."\r\n";
							
							//Create Job
							if(isset($job_detail->content)){
								$new_job				=	new Job;
								$new_job->title			=	$job_title;
								$new_job->description	=	$job_description;
								$new_job->ref_url		=	$ref_url;
								$new_job->ref_id		=	$ref_id;
								$new_job->ref_date		=	$ref_date;
								$new_job->company_id	=	$company_id;
								$new_job->type_id		=	($type_id) ? $type_id : 0;
								$new_job->min_qualification		=	($job_qualifications) ? $job_qualifications : "";
								$new_job->save();
								$this->job_count++;
							}
					
							$this->company_count++;
						}
					}
				
				}else{
					echo "No Job Details Found";
					continue;
				}
			}else{
				echo "No Job Url Found";
				continue;
			}
			//var_dump($job_detail->section);
					
			$count++;
		}

	}
}
