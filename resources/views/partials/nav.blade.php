<nav class="uk-navbar uk-navbar-attached" role="navigation" ng-controller="AuthCtrl">
	<div class="uk-container-center uk-container">
		<a href="" class="uk-navbar-toggle uk-visible-small"></a>
		<a href="#/" class="uk-navbar-brand uk-hidden"><i class="uk-icon-sticky-note-o"></i></a>
		<ul class="uk-navbar-nav">
			<li><a href="#jobs">Jobs</a></li>
		</ul>
		<div class="uk-navbar-flip uk-navbar-content">
			<button id="login" ng-if="!$root.$auth.isAuthenticated()" class="uk-button uk-button-primary" ng-click="showLoginModal()">Login</button>
			<div ng-if="$root.$auth.isAuthenticated()" class="uk-button-group">

				<!-- This is a button -->
				<button class="uk-button uk-button-primary" ng-click="logout()">Logout</button>

				<!-- This is the container enabling the JavaScript -->
				<div data-uk-dropdown="{mode:'click'}">

					<!-- This is the button toggling the dropdown -->
					<a href="" class="uk-button uk-button-primary"><i class="uk-icon-caret-down"></i></a>

					<!-- This is the dropdown -->
					<div class="uk-dropdown uk-dropdown-small">
						<ul class="uk-nav uk-nav-dropdown">
							<li><a href="#profile">My Account</a></li>
						</ul>
					</div>

				</div>
			</div>
		</div>
	</div>
</nav>

