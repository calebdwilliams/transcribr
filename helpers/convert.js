var FfmpegCommand = require('fluent-ffmpeg'),
	fs = require('fs'),
	async = require('async'),
	path = require('path');

module.exports = function(file, duration, vidId, path, callback) {
	// split the duration into an array ['HH', 'MM', 'SS.MS']
	var duration = duration.split(':');

	function getLength(durationSplit) {
		if (durationSplit.length === 3) {
			var time = 0,
				hours = durationSplit[0],
				minutes = durationSplit[1],
				seconds = durationSplit[2];

			time += parseFloat(hours * 60 * 60) + parseFloat(minutes * 60) + parseFloat(seconds);
			// return file length as an float
			return parseFloat(time);
		} else {
			callback('Error retreiving video length', null);
		}
	}

	var audioLength = getLength(duration);

	console.log(duration);

	if (audioLength < 10) {
		// Go ahead and send to wit
	} else {
		// break apart the file
		var files = [];
		console.log('Video is longer than 10 seconds');

		async.series([
			function(next) {
				for (var i = 0; i < audioLength; i += 9) {
					if (i == 0) {
						var counter = 0;
					} else {
						var counter = i / 9;
					}

					var newFile = path + '_' + counter + '.mp3',
						start = parseFloat(i);

					files.push({
						id: counter,
						start: i,
						end: i + 9,
						file: newFile
					});
					
					var command = FfmpegCommand(file)
						.seekInput(i + 3)
						.duration(9)
						.save(newFile)
						.on('codecData', function(data) {
							// console.log(data);
						})
						.on('error', function(err) {
							console.log(err);
						})
						.on('end', function() {
							// console.log(i);
						});
				}
				next(null, files);
			}
		], function(err, results) {
			callback(null, results[0]);
		});
	}
}