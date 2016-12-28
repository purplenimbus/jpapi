<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Job Portal | </title>
	
	<!-- bower:css -->
	<link rel="stylesheet" href="/bower_components/angular-xeditable/dist/css/xeditable.css" />
	<link rel="stylesheet" href="/bower_components/materialize/bin/materialize.css" />
	<!-- endbower -->
	
	<link rel="stylesheet" href="{{ URL::asset('css/main.css') }}">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body ng-app="jpApp">
	@include('partials.nav')

	<div class="loading">
		<div class="preloader-wrapper big active">
			<div class="spinner-layer spinner-blue-only">
			  <div class="circle-clipper left">
				<div class="circle"></div>
			  </div><div class="gap-patch">
				<div class="circle"></div>
			  </div><div class="circle-clipper right">
				<div class="circle"></div>
			  </div>
			</div>
		</div>
	</div>
	<div ng-view id="view">
	
	</div>

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
    <script>
       !function(A,n,g,u,l,a,r){A.GoogleAnalyticsObject=l,A[l]=A[l]||function(){
       (A[l].q=A[l].q||[]).push(arguments)},A[l].l=+new Date,a=n.createElement(g),
       r=n.getElementsByTagName(g)[0],a.src=u,r.parentNode.insertBefore(a,r)
       }(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

       ga('create', 'UA-XXXXX-X');
       ga('send', 'pageview');
    </script>
	
	<!-- bower:js -->
	<script src="/bower_components/jquery/dist/jquery.js"></script>
	<script src="/bower_components/angular/angular.js"></script>
	<script src="/bower_components/angular-animate/angular-animate.js"></script>
	<script src="/bower_components/angular-cookies/angular-cookies.js"></script>
	<script src="/bower_components/angular-resource/angular-resource.js"></script>
	<script src="/bower_components/angular-route/angular-route.js"></script>
	<script src="/bower_components/angular-sanitize/angular-sanitize.js"></script>
	<script src="/bower_components/angular-touch/angular-touch.js"></script>
	<script src="/bower_components/satellizer/dist/satellizer.js"></script>
	<script src="/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
	<script src="/bower_components/angular-xeditable/dist/js/xeditable.js"></script>
	<script src="/bower_components/moment/moment.js"></script>
	<script src="/bower_components/ckeditor/ckeditor.js"></script>
	<script src="/bower_components/materialize/bin/materialize.js"></script>
	<!-- endbower -->
	
	<script src="{{ URL::asset('js/all.js') }}"></script>
</body>
</html>
