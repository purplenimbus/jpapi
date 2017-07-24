<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Http\Requests;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Auth;
use GuzzleHttp;
use GuzzleHttp\Subscriber\Oauth\Oauth1;
use Config;
use MongoDB;
use	App\Application;

class AuthenticateController extends Controller
{
	var $mongo;
	
	public function __construct()
	{
	   // Apply the jwt.auth middleware to all methods in this controller
	   // except for the authenticate method. We don't want to prevent
	   // the user from retrieving their token if they don't already have it
	   $this->middleware('jwt.auth', ['except' => ['authenticate','linkedin','getProfile','saveProfile']]);
	   
	   $this->mongo = new MongoDB\Client(env('MONGOURI', false));
	}
	
	public function authenticate(Request $request)
    {
		
        $credentials = $request->only('email', 'password');
		
        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
		
		$user = Auth::user();
        // if no errors are encountered we can return a JWT
        return response()->json(compact(['token','user']));
    }
	
	/**
     * Login with LinkedIn.
     * @params Request
     */
    public function linkedin(Request $request)
    {
        $client = new GuzzleHttp\Client();
		
		var_dump($request->all());
		
		echo "linked in secret".env('LINKEDIN_SECRET');
		
        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => env('LINKEDIN_SECRET'),
            'redirect_uri' => $request->input('redirectUri'),
            'grant_type' => 'authorization_code',
        ];
        // Step 1. Exchange authorization code for access token.
        $accessTokenResponse = $client->request('POST', 'https://www.linkedin.com/uas/oauth2/accessToken', [
            'form_params' => $params
        ]);
		
        $accessToken = json_decode($accessTokenResponse->getBody(), true);
        // Step 2. Retrieve profile information about the current user.
        $profileResponse = $client->request('GET', 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address)', [
            'query' => [
                'oauth2_access_token' => $accessToken['access_token'],
                'format' => 'json'
            ]
        ]);
        $profile = json_decode($profileResponse->getBody(), true);
        // Step 3a. If user is already signed in then link accounts.
        if ($request->header('Authorization'))
        {
            $user = User::where('linkedin', '=', $profile['id']);
            if ($user->first())
            {
                return response()->json(['message' => 'There is already a LinkedIn account that belongs to you'], 409);
            }
            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));
            $user = User::find($payload['sub']);
            $user->linkedin = $profile['id'];
            $user->fname = $user->fname ?: $profile['firstName'];
            $user->lname = $user->lname ?: $profile['lastName'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('linkedin', '=', $profile['id']);
            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first())]);
            }
            $user = new User;
            $user->linkedin = $profile['id'];
            $user->fname =  $profile['firstName'];
            $user->lname =  $profile['lastName'];
            $user->save();
            return response()->json(['token' => $this->createToken($user)]);
        }
    }
	
	/**
     * Return Account Info
     * @params Request
     */
	public function get_user(){
		$user = Auth::user();
		
		if($user){
			return $user;
		}else{
			return false;
		}
	}
	
	/**
     * get user profile details
     * @params Request
     */
	public function getProfile($id){
				
		$profile = $this->mongo->users->profiles->findOne([ 'user_id' => (int)$id ]);
		
		//var_dump($profile);
		$job_applications = Application::where(['user_id' => $this->getAuthenticatedUser()->getData()->user->id])
											->latest()
											->limit(10)
											->get()
											->each(function($a){
												$a->has('job') ? $a['job'] = $a->job->select(array('title', 'id'))->get() : null;
											});
		
		//var_dump($job_applications);
		
		$profile->applications = $job_applications;
		
		if($profile){
			return response()->json([$profile],200);
		}else{
			return response()->json(['message' => 'profile not found'],200);
		}
	}
	
	/**
     * save user profile details
     * @params Request
     */
	
	public function saveProfile($id,Request $request){
				
		//save to mongo
		if($request){
			
			$data = $request->all();
			
			$data ? 
				$profile = $this->mongo->users->profiles->updateOne(
					['user_id' 	=> (int)$id ],
					['$set' 	=> ['resume' => json_encode($data) ] ]
				)
			: null;
			
			//return response
			//if($profile){
				return response()->json($data,200);
			/*}else{
				return response()->json(['message' => 'profile not found'],200);
			}*/
		}
	}
	
	// somewhere in your controller
	public function getAuthenticatedUser()
	{
		try {

			if (! $user = JWTAuth::parseToken()->authenticate()) {
				return response()->json(['user_not_found'], 404);
			}

		} catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

			return response()->json(['token_expired'], $e->getStatusCode());

		} catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

			return response()->json(['token_invalid'], $e->getStatusCode());

		} catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

			return response()->json(['token_absent'], $e->getStatusCode());

		}

		// the token is valid and we have found the user via the sub claim
		return response()->json(compact('user'));
	}
}
