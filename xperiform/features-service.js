var Promise = require('promise');
var PouchDB = require('pouchdb');
var path = require('path');
var featuresDB = new PouchDB(path.join(__dirname, 'features_db'));

// features service
module.exports = {
	getFeatures = function(featureIds) {
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
	initDB = function() {
		var feature1 = {
			_id: 1,
			featurePercentage: 50,
			_rev: 1.0
		};
		featuresDB.put(feature1, function callback(err, result) {
			if (!err) {
				console.log('Successfully posted feature 1!');
			}
		});
		var feature2 = {
			_id: 2,
			featurePercentage: 50,
			_rev: 1.0
		};
		featuresDB.put(feature2, function callback(err, result) {
			if (!err) {
				console.log('Successfully posted feature 2!');
			}
		});
	},
	setFeatures = funciton(featureIdsAndPercentage) {
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
						featurePercentage: featureIdsAndPercentage[id].featurePercentage)
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
									featurePercentage: featureIdsAndPercentage[response.key].featurePercentage),
									_id: setResponse[index].id,
									_rev: setResponse[index].rev
								}
							};
						} else {
							response.doc.featurePercentage = featureIdsAndPercentage[response.key].featurePercentage);
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
