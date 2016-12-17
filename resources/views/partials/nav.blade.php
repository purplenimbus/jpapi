<nav class="navbar navbar-default navbar-fixed-top" ng-controller="AuthCtrl">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			</button>
			<!-- <a class="navbar-brand" href="#">Project name</a> -->
		</div>
		<div id="navbar" class="collapse navbar-collapse">
			<ul class="nav navbar-nav navbar-left">
				<li><a href="#jobs">Jobs</a></li>
			</ul>
			<form class="navbar-form navbar-right" role="search">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Search for...">
					<span class="input-group-btn">
						<button class="btn btn-default" type="button">Go!</button>
					</span>
				</div><!-- /input-group -->
			</form>
			<ul class="nav navbar-nav navbar-right">
				<li><button type="button" class="btn btn-default navbar-btn" ng-click="signIn($event)">Sign in</button></li>
			</ul>
		</div><!--/.nav-collapse -->
	</div>
</nav>