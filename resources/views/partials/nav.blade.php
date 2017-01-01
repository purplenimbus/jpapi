<!-- Account Dropdown -->
<ul id="account" class="side-nav">
    <li ng_show="!$root.logged_in"><div class="userView">
		<div class="background">
			<img src="http://img10.deviantart.net/7dfc/i/2010/062/1/4/panoramic_landscape_by_compot_stock.jpg" height="100%">
		</div>
		<a href="#!user"><img class="circle" src="http://www.iconsfind.com/wp-content/uploads/2016/10/20161014_58006bf6e7079.png"></a>
		<a href="#!name"><span class="white-text name">John Doe</span></a>
		<a href="#!email"><span class="white-text email">jdandturk@gmail.com</span></a>
		</div>
	</li>
	<li ng_show="$root.logged_in"><a ng-click="logout()"><i class="material-icons">cloud</i> Log out</a></li>
	<li ng_show="$root.logged_in" class="divider"></li>
	<li><a href="#view_account"><i class="material-icons">cloud</i> My Account</a></li>
</ul>

<div class="navbar-fixed">
	<nav class="teal accent-3" role="navigation" ng-controller="AuthCtrl">
		<div class="nav-wrapper container">
			<a id="logo-container" href="#/" class="brand-logo">
				<i class="material-icons">explore</i>
			</a>
			<ul class="right hide-on-med-and-down">
				<li><a href="#jobs">Jobs</a></li>
				<li ng_show="!$root.logged_in"><a ng-click="signIn()"> Sign In</a></li>
				<li><a class="account-collapse" data-activates="account"><i class="material-icons">account_circle</i></a></li>
			</ul>
			<ul id="nav-mobile" class="side-nav" style="transform: translateX(-100%);">
				<li><a href="#jobs">Jobs</a></li>
				<li><a class="waves-effect waves-light btn" ng-click="login()">Login</a></li>
				<li ng_show="$root.logged_in"><a class="waves-effect waves-light btn" ng-click="my_account()">My Account</a></li>
			</ul>
			<a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
		</div>
	</nav>
</div>
