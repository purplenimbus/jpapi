var elixir = require('laravel-elixir');
var gulp = require("gulp");
var wiredep = require("laravel-elixir-wiredep");

var paths = {
    'bootstrap': './public/bower_components/bootstrap-sass/assets/'
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
 
elixir(function(mix) {
    mix.sass('main.scss','public/css/', {includePaths: [paths.bootstrap + 'stylesheets/']})
		.scriptsIn()
        .wiredep('resources/views/layouts.app.blade.php');
});
