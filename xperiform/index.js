var express = require('express');
var gulp = require('gulp');
var image = require('gulp-image');

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

//app.get('/image', function(req, res, next) {
app.get('/image', function(req, res, next) {
	// get number between 0-100
	var randomNumber = Math.floor(Math.random()*99);
	console.log(randomNumber);
	// If > 50, route to next route
	if (randomNumber > 49) {
	//	next('route');
		res.send('1');
		first(function() {
			console.log('done');
		});
	}
	// otherwise pass the control to the next middleware function
	else {
	//	next();
		res.send('2');
		second(function() {
			console.log('done');
		});
	}
//}, function (req, res, next) {
//	res.send('1');
});

//app.get('/image', function(req, res, next) {
//	res.send('2');
//});

app.listen(3000, function() {
	console.log('Listening on port 3000');
});