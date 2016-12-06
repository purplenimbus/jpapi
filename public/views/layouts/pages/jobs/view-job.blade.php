@extends('layouts.page')

@section('content')
	<div class="row" ng-controller="JobsCtrl">
		<aside class="col-md-3 sidebar">
			<div class="panel panel-default">
				<div class="panel-body">
					Panel content
				</div>
				<div class="panel-footer">Panel footer</div>
			</div>
		</aside>
		<main class="col-md-6">
			<div id="filter" class="row">
				<div class="col-md-12">
					
				</div>
			</div>
			<div id="content" class="row">
				<div class="col-md-12">
					<p>This is a job page</p>
				</div>
			</div>
		</main>
		<aside class="col-md-3 inset">
			
		</aside>
	</div>
@endsection