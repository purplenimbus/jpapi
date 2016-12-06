@extends('layouts.app')

@section('page')
	<div id="header" class="row">
		<div class="col-md-12 hide">
			<h1>{{ isset($page_title) ? $page_title : 'Page Title' }}</h1>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12 content">
			<p>@yield('content')</p>
		</div>
	</div>
@endsection