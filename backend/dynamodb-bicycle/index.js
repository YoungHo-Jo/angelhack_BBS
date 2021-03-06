//{"id":"bicycle1", "lat" : 37.777787, "lon" : -123.416295}
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


function calDist(lhs, rhs){
	const RAD = 0.000008998719243599958;
	console.log("lhs : (" + lhs.lat +","+lhs.lon + ") rhs: (" + rhs.lat +", " + rhs.lot + ")");
	return Math.sqrt(Math.pow(lhs.lat - rhs.lat, 2) + Math.pow(lhs.lon - rhs.lon, 2)) / RAD;
}

// find area : not complete function 
// function findArea(h_coordi){
// 	var params = {
// 		TableName: 'user'
// 	}
// 	return dynamoDb.scan(params).promise().then(function (response) {
// 		response.Items.forEach
// 		JSONObject obj = new JSONObject(response.Items.toString());
// 		for (var x in obj)
// 			if (obj.hasOwnProperty(x))
// 				console.log(calDist(h_coordi,x));
// 	});
// }
// Create new user
api.post('/bicycle', function (request) {
	'use strict';
	var params = {
		TableName: request.env.tableName,
		Item: {
			id: request.body.id,
			lat: request.body.lat,
			lon: request.body.lon,
			rent : request.body.rent,
			zone : request.body.zone
		}
	};

	var data = {}
	data = {
	}
	// return dynamo result directly
	return dynamoDb.put(params).promise();
}, { success: 201 }); // Return HTTP status 201 - Created when successful

// get user for {id}
// get commend : /?area, nonarea, id
api.get('/bicycle/{id}', function (request) {
	'use strict';
	var getData, params;
	// Get the id from the pathParams
	getData = getUrlVars(request.pathParams.id);
	
	if(getData.hasOwnProperty("nonarea") === true){
		console.log("[nonarea]");
		// post-process dynamo result before returning
		params = {
			TableName: request.env.tableName,
			ExpressionAttributeNames: {
				"#zone": "zone",
			},
			FilterExpression: 'attribute_not_exists(#zone)'

		}
		return dynamoDb.scan(params).promise().then(function (response) {
			return response.Items;
		});
	}
	else if(getData.hasOwnProperty("area") === true){
		console.log("[area]");
		params = {
			TableName: request.env.tableName,
			ExpressionAttributeNames: {
				"#zone": "zone",
			},
			FilterExpression: 'attribute_exists(#zone)'
		}
		return dynamoDb.scan(params).promise().then(function (response) {
			return response.Items;
		});
	}
	else if(getData.hasOwnProperty("id") === true){
		console.log("[id]");
		params = { 
			TableName: request.env.tableName,
			Key: {
				id: getData.id
			}
		};
		return dynamoDb.get(params).promise().then(function (response) {
			return response.Item;
		});
	}
});

api.put('/bicycle/{id}', function (request) {
	'use strict';
	var commend, params;
	// Get the id from the pathParams
	commend = request.pathParams.id;
	params = {
		TableName: request.env.tableName,
		Key: {
			id: request.body.id
		}
	};

	if(commend === 'park'){
		// post-process dynamo result before returning
		var zone = findArea(request.body)
		var params_put = {
			TableName: request.env.tableName,
			Item: {
				id  : request.body.id,
				lat : request.body.lat,
				lon : request.body.lon,
				// zone : response.Item.zone
				zone : (zone !== null ? zone : request.body.zone)
			}
		}
		return dynamoDb.put(params_put).promise();
	}
	else if(commend === 'rent'){
		return dynamoDb.get(params).promise().then(function (response) {
			var params_put = {
				TableName: request.env.tableName,
				Item: {
					id  : request.body.id,
					lat : response.Item.lat,
					lon : response.Item.lon,
					rent : request.body.rent,
					zone : response.Item.zone
				}
			}
			return dynamoDb.put(params_put).promise();
		});
	}
});

// delete user with {id}
api.delete('/bicycle/{id}', function (request) {
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

