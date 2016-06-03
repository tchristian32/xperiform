var Promise = require('promise');
var PouchDB = require('pouchdb');
var path = require('path');
var featuresDB = new PouchDB(path.join(__dirname, 'features_db'));

// features service
module.exports = {
	getAllFeatures: function() {
		return featuresDB.allDocs({include_docs: true}).then(function(dbResponse) {
			var features = {};
			dbResponse.rows.forEach(function(row) {
				if (row.error) {
					if (row.error == "not_found") {
						features[row.key] = {doc: null};
					} else {
						features[row.key] = {error: row.error};
					}
				} else if (row.doc) {
					features[row.key] = row;
				} else {
					features[row.key] = {doc: null};
				}
			});
			return features;
		});
	},
	getFeatures: function(featureIds) {
		return featuresDB.allDocs({
			keys: featureIds.map(function(id) {
				return id;
			}),
			include_docs: true
		}).then(function(dbResponse) {
			var features = {};
			dbResponse.rows.forEach(function(row) {
				if (row.error) {
					if (row.error == "not_found") {
						features[row.key] = {doc: null};
					} else {
						features[row.key] = {error: row.error};
					}
				} else if (row.doc) {
					features[row.key] = row;
				} else {
					features[row.key] = {doc: null};
				}
			});
			return features;
		});
	},
	initDB: function() {
		var image1 = {
			_id: '1',
			featurePercentage: 50,
			active: true,
			feature: 1,
			artifactFolder: 'image',
			variationFolder: '1'
		};
		featuresDB.put(image1, function callback(err, result) {
			if (!err) {
				console.log('Successfully posted image 1!');
			} else {
				console.log(err);
			}
		});
		var image2 = {
			_id: '2',
			featurePercentage: 50,
			active: true,
			feature: 2,
			artifactFolder: 'image',
			variationFolder: '2'
		};
		featuresDB.put(image2, function callback(err, result) {
			if (!err) {
				console.log('Successfully posted image 2!');
			} else {
				console.log(err);
			}
		});
		var html1 = {
			_id: '3',
			featurePercentage: 50,
			active: true,
			feature: 1,
			artifactFolder: 'html',
			variationFolder: '1'
		};
		featuresDB.put(html1, function callback(err, result) {
			if (!err) {
				console.log('Successfully posted html 1!');
			} else {
				console.log(err);
			}
		});
		var html2 = {
			_id: '4',
			featurePercentage: 50,
			active: true,
			feature: 2,
			artifactFolder: 'html',
			variationFolder: '2'
		};
		featuresDB.put(html2, function callback(err, result) {
			if (!err) {
				console.log('Successfully posted html 2!');
			} else {
				console.log(err);
			}
		});
	},
	setFeatures: function(featureIdsAndPercentage) {
		var ids = Object.keys(featureIdsAndPercentage);
		
		return featuresDB.allDocs({
			keys: ids.map(function(id) {
				return id;
			}),
			include_docs: true
		}).then(function(getResponse) {
			return featuresDB.bulkDocs(
				ids.filter(function(id, index) {
					return !(getResponse.rows[index].doc == null || getResponse.rows[index].error == "not_found");
				}).map(function(id, index) {
					return {
						_id: id,
						_rev: (!getResponse.rows[index].error ? getResponse.rows[index].value.rev : undefined),
						featurePercentage: featureIdsAndPercentage[id].featurePercentage
					};
				})
			).then(function(setResponse) {
				var results = {};
				getResponse.rows.forEach(function(response, index) {
					if (!setResponse[index]) {
						results[response.key] = {doc: null};
					} else if (setResponse[index].ok) {
						if (getResponse.rows[index].doc == null || getResponse.rows[index].error) {
							results[response.key] = {
								id: setResponse[index].id,
								key: setResponse[index].id,
								value: {
									rev: setResponse[index].rev
								},
								doc: {
									featurePercentage: featureIdsAndPercentage[response.key].featurePercentage,
									_id: setResponse[index].id,
									_rev: setResponse[index].rev
								}
							};
						} else {
							response.doc.featurePercentage = featureIdsAndPercentage[response.key].featurePercentage;
							results[response.key] = response;
						}
					} else {
						results[response.key] = {error: setResponse[index].message};
					}
				});
				return results;
			});
		});
	}
};
