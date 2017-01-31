var elixir = require('laravel-elixir');
var gulp = require("gulp");
var wiredep = require("laravel-elixir-wiredep");
 
require( 'elixir-jshint' );
require('laravel-elixir-imagemin');

var paths = {
    'bootstrap': './public/bower_components/bootstrap-sass/assets/',
    'materialize': './public/bower_components/materialize/sass/'
}

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.config.js.browserify.watchify = {
    enabled: true,
    options: {
        poll: true
    }
}

elixir.config.images = {
    folder: 'img',
    outputFolder: 'img'
};
 
elixir(function(mix) {
    mix.sass('main.scss','public/css/', {includePaths: [paths.bootstrap + 'stylesheets/',paths.materialize+'components/']})
		//.scripts(['./public/bower_components/materialize/extras/noUiSlider/nouislider.min.js'])
		.scriptsIn()
		.styles([
			'./public/bower_components/materialize/extras/noUiSlider/nouislider.css'
		])
        .wiredep('resources/views/layouts.app.blade.php')
		//.jshint();
		.imagemin();
});
