'use strict';

var express = require('express');
var gulp = require('gulp');
var image = require('gulp-image');
var featureService = require('./features-service');

var app = express();

// should this be a route?

// respond when a GET request is made to the homepage
app.get('/', function(req, res) {
	res.send('hello world');
});

function first(done) {
	//gulp.src('./src/**/*.js')
	gulp.src('../image/1/*')
	//.pipe(image())
	.pipe(gulp.dest('./dist'))
    .on('end', function () {
      if (done) { 
        done(); // callback to signal end of build
      }
    });
}

function second(done) {
	//gulp.src('./src/**/*.js')
	gulp.src('../image/2/*')
	//.pipe(image())
	.pipe(gulp.dest('./dist'))
    .on('end', function () {
      if (done) { 
        done(); // callback to signal end of build
      }
    });
}

app.get('/init', function(req, res) {
	featureService.initDB();
});

app.get('/listdata', function(req, res) {
	featureService.getFeatures(['1', '2']).then(function(res) {
		console.log(JSON.stringify(res, null, 4));
	});
});

app.get('/image', function(req, res, next) {
	var options = {
		root: __dirname + '/dist/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
			}
	};
  
	// get number between 0-100
	var randomNumber = Math.floor(Math.random()*99);
	console.log(randomNumber);
	// If > 49, use first image
	if (randomNumber > 49) {
	//	next('route');
		first(function() {
			console.log('done');
			res.sendFile('image.jpg', options, function(err) {
				if (err) {
					console.log(err);
					res.status(err.status).end();
				}
			});
		});
	}
	// otherwise use the second image
	else {
	//	next();
		second(function() {
			console.log('done');
			res.sendFile('image.jpg', options, function(err) {
				if (err) {
					console.log(err);
					res.status(err.status).end();
				}
			});
		});
	}
});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});