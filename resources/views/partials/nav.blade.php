<div class="navbar-fixed">
	<nav class="teal accent-3" role="navigation" ng-controller="AuthCtrl">
		<div class="nav-wrapper container">
			<a id="logo-container" href="#/" class="brand-logo">
				<i class="material-icons">explore</i>
			</a>
			<ul class="right hide-on-med-and-down">
				<li><a href="#jobs">Jobs</a></li>
				<li ng-if="!$root.$auth.isAuthenticated()"><a ng-click="signIn()"> Sign In</a></li>
				<li ng-if="$root.$auth.isAuthenticated()"><a class="dropdown-button" data-activates="account"><i class="material-icons">account_circle</i></a></li>
				<!-- Dropdown Structure -->
				<ul id="account" class="dropdown-content">
					<li ng-if="$root.$auth.isAuthenticated()"><a href="#myaccount" ui-sref-active="active"> My Account</a></li>
					<li ng-if="$root.$auth.isAuthenticated()"><a ng-click="logout()"> Logout</a></li>
				</ul>
			</ul>
			<ul id="nav-mobile" class="side-nav" style="transform: translateX(-100%);">
				<li><a href="#jobs">Jobs</a></li>
				<li ng-if="!$root.$auth.isAuthenticated()"><a class="waves-effect waves-light btn" ng-click="login()">Login</a></li>
				<li ng-if="$root.$auth.isAuthenticated()"><a class="waves-effect waves-light btn" ng-click="my_account()">My Account</a></li>
			</ul>
			<a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
		</div>
	</nav>
</div>
