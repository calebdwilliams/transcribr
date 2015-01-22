var wit = require('node-wit'),
	fs = require('fs');

var ACCESS_TOKEN = "TOKEN";

module.exports = function(file, callback) {
	var stream = fs.createReadStream(file);

	// need to figure out optimatl mimetype

	wit.captureSpeechIntent(ACCESS_TOKEN, stream, 'audio/mpeg', function(err, res) {
		if (err) {throw err;}

		var result = JSON.stringify(res, null, ' ');

		// the null is the error
		// how to throw actual error?
		callback(null, result);
	});
}