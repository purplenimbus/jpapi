@extends('layouts.page')

@section('content')
	<div class="row" ng-controller="JobsCtrl">
		<aside class="col-md-2 sidebar">
			<div class="panel panel-default">
				<div class="panel-body">
					<h3>Salary</h3>
					<h3>Job Location</h3>
					<ul class="list-unstyled">
						<li>(3) Job Location</li>
						<li>(5) Job Location</li>
					</ul>
					<h3>Job Category</h3>
					<ul class="list-unstyled">
						<li>(3) Job Category</li>
						<li>(5) Job Category</li>
					</ul>
					<h3>Job Type</h3>
					<ul class="list-unstyled">
						<li>(3) Job Type</li>
						<li>(5) Job Type</li>
					</ul>
				</div>
			</div>
		</aside>
		<main class="col-md-7">
			<div id="filter" class="row">
				<div class="col-md-12">
			
				</div>
			</div>
			<div id="content" class="row">
				<div class="col-md-12">
					<ul class="list-unstyled row jobs">
					{{-- @each('layouts.pages.jobs.job', $jobs, 'job','layouts.pages.jobs.empty') --}}
					</ul>
				</div>
			</div>
		</main>
		<aside class="col-md-3 inset">
			
		</aside>
	</div>
@endsection