'use strict';

/**
 * @ngdoc service
 * @name jpApp.wordpress
 * @description
 * # wordpress
 * Service in the jpApp.
 */
angular.module('jpApp')
	.service('wordpress', function ($http,elements,$rootScope,$auth) {
		
		var wp_endpoint = 'http://purplenimbus.net/jp/wp-json/wp/v2/';
		
		return{
			/**
			 * Returns a $http.get promise to get a job based on the job id
			 * @param {object} $data - The data for the GET request
			 * @param {integer} $id - The id for the GET request
			 * @returns {Promise}
			 */
			getData	:	function($data,$id,$params){	
				var logged_in = $auth.isAuthenticated();
								
				return	$http.get(wp_endpoint+$data+($id ? '/'+$id : '')+(logged_in ? '?token='+$auth.getToken() : ''));
			},
			/**
			 * Returns a $http.put or post promise to store a job based on job id and its data
			 * @param {String} $name - The name of the PUT/POST endpoint
			 * @param {object} $data - The data for the PUT/POST request
			 * @param {integer} $id - The id for the PUT/POST enpoint
			 * @returns {Promise}
			 */
			sendData	:	function($name,$id,$data){
				console.log($name+' id',$id);
				return	$http.post(wp_endpoint+'/'+$name+($id ? '/'+$id : ''),$data);
			},
			/**
			 * Returns a $http.put or post promise to store a job based on job id and its data
			 * @param {String} $name - The name of the PUT/POST endpoint
			 * @param {object} $data - The data for the PUT/POST request
			 * @param {integer} $id - The id for the PUT/POST enpoint
			 * @returns {Promise}
			 */
			findJobs : function(location_id,job_id){
				return $http.get('api/locations/'+location_id+'/wordpress/'+job_id);
			},
			/**
			 * Parse Wordpress data and return it to match the frontend
			 * @param {object} data - The data for the PUT/POST request
			 * @returns {WPData}
			 */
			parseWPData : function(data){
				var wp_data = {
					/*application_deadline:null
					company:{id: 1, name: "fosad consulting",…}
					created_at:"2017-11-04 11:16:53"
					description:"<p><strong>Role Summary</strong></p>↵<ul>↵<li>Energy Consulting, a part of GE Energy Connections, offers our global clients (external &amp; internal GE) a wide range of solutions across the entire spectrum of power generation, delivery and utilization.</li>↵</ul>↵<p><strong>Essential Responsibilities</strong></p>↵<ul>↵<li>Energy Consulting is divided into four Practice Areas: Power Economics, Power Systems Operation and Planning (PSOP), Global Power Projects, and Software.</li>↵<li>Our Power Economics team offers analyses focused on understanding and study of the financial and physical operation of the electric power systems including generation and grid planning, system optimization, asset valuation, competitive power markets and energy policy implications.</li>↵<li>Our Power Systems Operation and Planning team utilizes their deep knowledge of connected power grid planning, design, operation, and life-cycle management, to offer customized solutions to our global clients and other GE businesses.</li>↵<li>The Global Power Projects group supports new and upgraded thermal power plants with grid code testing, PSS settings, and power plant monitors (TSRs and TSAs) as well NPI, model development, field testing, and proposal support for GE Wind projects and proposals.</li>↵<li>The Software COE develops and licenses several different software products and has over 700 users worldwide of EC’s Concorda Suite of software tools to assess the economics, performance, and reliability of interconnected power systems. Energy Consulting also offers a full range of power system education courses through our Power Systems Engineering Course (PSEC).</li>↵</ul>↵<p><strong>Essential Functions/Responsibilities</strong></p>↵<ul>↵<li>This position is for a Principal Consultant with a focus on Power Systems Operations &amp; Planning, within Energy Consulting, working across the organization.</li>↵<li>Support GE business initiatives related to the systems equipment and services of the business, and provide advisory services to our industry</li>↵<li>Perform power system analysis including: modeling, simulation, and evaluation of design alternatives</li>↵<li>Lead the development/refinement of tools and techniques for power system simulation</li>↵<li>Effectively communicate results to both internal and external executives by preparing written detailed and summary reports and making presentations describing analyses performed, solutions developed, and customer value propositions</li>↵<li>Identify and cultivate new customers and business opportunities. Develop projects with customers; manage contracts to ensure technical, schedule and cost objectives are met; actively participate in identifying and cultivating new customers and business opportunities; lead preparation of proposals; and make customer presentations</li>↵<li>Actively participate in strategic planning and development of GE product/service offerings and support New Product/Technology Introductions concurrent with GE business needs.</li>↵<li>Provide mentoring and help develop/train less experienced staff in a working environment where teamwork, quality, customer service and innovation are highly valued</li>↵<li>Actively participate in Industry forums to promote GE solutions and technology</li>↵<li>Support and help staff the Power Systems and Energy Courses (PSEC)</li>↵</ul>↵<p><strong>Qualifications/Requirements</strong></p>↵<ul>↵<li>Bachelor’s degree from an accredited university or college in Electrical, Mechanical, or Electric Power Engineering</li>↵<li>At least 10 years of professional experience in engineering, product management or a related function</li>↵<li>Strong analytical and problem solving skills with demonstrated ability to lead engineering / economics teams to high value technical / economic solutions</li>↵<li>Solid understanding of power systems phenomena and power systems equipment: generation, transmission, distribution and industrial</li>↵<li>Understanding of protection design concepts for major power systems equipment</li>↵<li>Understanding of controls concepts for grid-interactive power systems equipment</li>↵<li>Working knowledge of key software analytical tools, e.g., ATP, PSLF, PSS/E, MATLAB, Python, and PSCAD</li>↵<li>Demonstrated capability to complete projects on-time and on-budget as either individual contributor or project manager</li>↵<li>Proficiency with office productivity software e.g. MS Office, Visio, MS Project</li>↵<li>Ability and willingness to travel a minimum of 20% of the time, as required</li>↵</ul>↵<p><strong>Desired Characteristics:</strong></p>↵<ul>↵<li>Advanced degree in electrical, mechanical or electric power engineering from an accredited university or college</li>↵<li>Strong interpersonal and leadership skills</li>↵<li>Ability to motivate and influence individuals and teams</li>↵<li>Strong written and oral communication skills suitable for making presentations to internal and external business executives, and for supporting GE executive external communications</li>↵<li>Proficiency with office productivity software e.g. MS Office</li>↵<li>Industry stature IEEE / CIGRE, ASME, AWEA, PE with published papers in one or more technical societies</li>↵<li>Pending or awarded patents</li>↵<li>Six Sigma training is preferred (GE only)</li>↵<li>A valid NYSC discharge or exemption certificate will be required (please indicate clearly on your resume)</li>↵<li>Must have valid authorization to work full-time without any restriction in Nigeria</li>↵</ul>↵"
					id:4
					job_level:{id: 2, name: "intermediate", description: ""}
					job_location_id:0
					job_ref_id:null
					job_salary_id:20
					job_skills:""
					job_type:{id: 2, name: "full time", description: ""}
					location:null
					min_experience:1
					min_qualification	:	"none"
					ref_url		:	null,
					salary		:	null,
					skills		:	null,
					status		:
					title		:,
					updated_at	:*/
				};
				
				for(var k in data){
					//console.log('wordpress key',k);
					switch(k){
						case 'title' 	: 	wp_data['title'] = data[k].rendered;	break;
						case 'content' 	: 	wp_data['description'] = data[k].rendered;	break;
						case 'excerpt' 	: 	wp_data['excerpt'] = data[k].rendered;	break;
						case 'modified' : 	wp_data['updated_at'] = data[k];	break;
						case 'date' 	: 	wp_data['created_at'] = data[k];	break;
						case 'meta' 	: 	wp_data['salary'] = Number(data[k]['salary']) || null;	
											wp_data['min_experience'] = Number(data[k]['min_experience']);	
											wp_data['job_ref_id'] = data[k]['ref_url'];	
											wp_data[k] = data[k];
											break;
											
						default 		: 	wp_data[k] = data[k];	break;
					}
				};
				
				delete wp_data.job_level;
				delete wp_data.job_type;
				delete wp_data.tags;
				delete wp_data.template;
				delete wp_data.comment_status;
				delete wp_data.author;
				
				return wp_data;
			}
		};
	});
