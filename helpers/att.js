var watson = require('watson-js'),
	fs = require('fs');

module.exports = function(file, callback) {
	var appKey = 'appKey',
		appSecret = 'appSecret';

	var options = {
		client_id: appKey,
		client_secret: appSecret
	};

	// watson.Watson(options);

	// console.log(watson);

	// watson.getAccessToken(function(err, token) {
	// 	console.log(token);
	// })

	// var result = '';

	// callback(null, result);

	watson.Watson(options);
}