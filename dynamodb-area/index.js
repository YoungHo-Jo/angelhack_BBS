/*global require, module*/
var ApiBuilder = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
	api = new ApiBuilder(),
	dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;


function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}




// Create new user
api.post('/area', function (request) {
	'use strict';
	var params = {
		TableName: request.env.tableName,
		Item: {
			id: request.body.id,
			lat: request.body.lat,
			lon: request.body.lon
		}
	};
	// return dynamo result directly
	return dynamoDb.put(params).promise();
}, { success: 201 }); // Return HTTP status 201 - Created when successful

// get user for {id}
api.get('/area/{id}', function (request) {
	'use strict';
	var id, params;
	// Get the id from the pathParams
	// command = request.pathParams.command;
	id = request.pathParams.id;

	if(getUrlVars(id).hasOwnProperty("manager") === true){
		params = {
			TableName: request.env.tableName
		}
		return dynamoDb.scan(params).promise().then(function (response) {
			return response.Items;
		});

	}
	else if(id.indexOf("area") !== -1){
	//get parameter
		console.log("[get]");
		params ={
			TableName: request.env.tableName,
			Key: {
				id: id
			}
		};
		return dynamoDb.get(params).promise().then(function (response) {
			return response.Item;
		});
	}
	else{
	//scan parameter
	
		id = getUrlVars(id);
		var lat = parseFloat(id.lat);
		var lon = parseFloat(id.lon);
		var bias = 0.02;
		var lat_max = lat + bias;
		var lat_min = lat - bias;
		var lon_max = lon + bias;
		var lon_min = lon - bias;
		params = {
			TableName: request.env.tableName,
			ExpressionAttributeNames: {
				"#lat": "lat",
				"#lon": "lon" //here
			},
			ExpressionAttributeValues: {
				":lat_min": lat_min,
				":lat_max": lat_max,
				":lon_min": lon_min,
				":lon_max": lon_max
			},
			FilterExpression: "#lat > :lat_min AND #lat < :lat_max AND #lon > :lon_min AND #lon < :lon_max"

		}
		return dynamoDb.scan(params).promise().then(function (response) {
			return response.Items;
		});
	}
});


// delete user with {id}
api.delete('/area/{id}', function (request) {
	'use strict';
	var id, params;
	// Get the id from the pathParams
	id = request.pathParams.id;
	params = {
		TableName: request.env.tableName,
		Key: {
			id: id
		}
	};
	// return a completely different result when dynamo completes
	return dynamoDb.delete(params).promise()
		.then(function () {
			return 'Deleted user with id "' + id + '"';
		});
}, {success: { contentType: 'text/plain'}});

api.addPostDeployConfig('tableName', 'DynamoDB Table Name:', 'configure-db');

