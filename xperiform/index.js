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
	gulp.src(['../image/1/*', '../html/1/*'])
	//.pipe(image())
	.pipe(gulp.dest('./dist/1'))
    .on('end', function () {
      if (done) { 
        done(); // callback to signal end of build
      }
    });
}

function second(done) {
	//gulp.src('./src/**/*.js')
	gulp.src(['../image/2/*', '../html/2/*'])
	//.pipe(image())
	.pipe(gulp.dest('./dist/2'))
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
	featureService.getFeatures(['1', '2', '3', '4']).then(function(res) {
		console.log(JSON.stringify(res, null, 4));
	});
});

app.get('/image', function(req, res) {
	var variation = req.query.id;
	var options = {
		root: __dirname + '/dist/' + variation + '/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
			}
	};
	res.sendFile('image.jpg', options, function(err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
	});

});

app.get('/feature', function(req, res, next) {
	// get number between 0-100
	var randomNumber = Math.floor(Math.random()*99);
	console.log(randomNumber);
	featureService.getAllFeatures().then(function(featurelist) {
		try {
			var ids = Object.keys(featurelist);
			var featuregroups = [];
			ids.forEach(function(id) {
				var featureRecord = featurelist[id];
				if (featureRecord.doc) {
					var isActive = featureRecord.doc['active'];
					if (isActive) {
						var feature = featureRecord.doc['feature'];
						var featurePercentage = featureRecord.doc['featurePercentage'];
						var folder = featureRecord.doc['artifactFolder'];
						var variation = featureRecord.doc['variationFolder'];

						featuregroups[feature] += featurePercentage;
					}
				}
			});
		} catch (err) {
			console.log('error: ' + err.message);
		}
	});
	
	// If > 49, use first feature
	if (randomNumber > 49) {
		var options = {
			root: __dirname + '/dist/1/',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
				}
		};
	//	next('route');
		first(function() {
			console.log('done');
			res.sendFile('test1.html', options, function(err) {
				if (err) {
					console.log(err);
					res.status(err.status).end();
				}
			});
		});
	}
	// otherwise use the second image
	else {
		var options = {
			root: __dirname + '/dist/2/',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
				}
		};
	//	next();
		second(function() {
			console.log('done');
			res.sendFile('test2.html', options, function(err) {
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