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
api.post('/user', function (request) {
	'use strict';
	var data;

	// data.lat = weuhfw;

	// data = {
	// 	lat: wefoihwef,
	// 	...data,
	// }

	
	var params = {
		TableName: request.env.tableName,
		Item: {
			id: request.body.id,
			credit: request.body.credit,
			zone: request.body.zone
		}
	};
	// return dynamo result directly
	return dynamoDb.put(params).promise();
}, { success: 201 }); // Return HTTP status 201 - Created when successful

// get user for {id}
api.get('/user/{id}', function (request) {
	'use strict';
	var getData, params, params_put;
	// Get the id from the pathParams
	getData = getUrlVars(request.pathParams.id);
	var id  = getData.id;
	var credit = getData.credit;
	console.log("[credit] " + credit);
	

	params = {
		TableName: request.env.tableName,
		Key: {
			id: id
		}
	};

	// post-process dynamo result before returning
	return dynamoDb.get(params).promise().then(function (response) {
		if(credit === null){
			return response.Item;
		}
		else{
			response.Item.credit += credit;
			var params_put ={
				TableName: request.env.tableName,
				Item: response.Item
			};
			console.log("[new credit] : " + response.Item.credit.toString());
			dynamoDb.put(params_put).promise();
		}
	});
});

// delete user with {id}
api.delete('/user/{id}', function (request) {
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

