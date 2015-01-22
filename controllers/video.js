var wit = require('../helpers/wit'),
	convert = require('../helpers/convert'),
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	FfmpegCommand = require('fluent-ffmpeg'),
	att = require('../helpers/att'),
	watson = require('../helpers/att');

function generateName() {
	var possible = 'abcdefghijklmnopqrstuvwxyz1234567890',
		url = '';

	for (var i = 0; i < 6; i++) {
		url += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return url;
}

module.exports = {
	upload: function(req, res) {
		var saveFile = function() {

			var url = generateName();

			var tempPath = req.files.file.path,
				ext = path.extname(req.files.file.name).toLowerCase(),
				targetPath = path.resolve('./public/upload/' + url + ext);

			fs.rename(tempPath, targetPath, function(err) {
				if (err) {throw err};
			});

			wit(targetPath, function(err, result) {
				res.json(JSON.parse(result));
			});
		}

		saveFile();
	},
	uploadAudio: function(req, res) {
		// Audio logic goes here
	},
	convert: function(req, res) {
		var saveFile = function() {
			var url = generateName(),
				tempPath = req.files.file.path,
				ext = path.extname(req.files.file.name).toLowerCase(),
				targetPath = path.resolve('public/upload/temp/' + url),
				newFile = targetPath + '.mp3';
			
			var command = FfmpegCommand(tempPath)
				.format('mp3')
				.on('error', function(err) {
					throw err;
				})
				.save(newFile)
				.on('end', function() {
					console.log('Converted to ' + newFile);
					return newFile;
				});

			function fileExists(file) {
				if (fs.existsSync(file)) {
					console.log('file: ' + file);
					wit(file, function(err, result) {
						res.json(JSON.parse(result));
					});
				} else {
					setTimeout(function() {
						fileExists(newFile);
					}, 500);
				}
			}

			function processAudio(newFile) {
				wit(newFile, function(err, result) {
					res.json(JSON.parse(result));
				});
			}

			fileExists(newFile);
		}

		saveFile();
	},
	newMethod: function(req, res) {
		var saveFile = function() {
			var url = generateName(),
				tempPath = req.files.file.path,
				ext = path.extname(req.files.file.name).toLowerCase(),
				targetPath = path.resolve('public/upload/temp/' + url),
				newFile = targetPath + '.mp3';
			
			var command = FfmpegCommand(tempPath)
				.on('start', function(commandLine) {
					console.log('Extracting audio, please wait ... ');
				})
				.save(newFile)
				.on('codecData', function(data) {
					// if you did this with async, you could pass along the new file and the duration in an object to the next function
					// that function would then break the files apart and pass to the next function the total number of files and their locations
					// the final function could begin constructing the object to have the data
					// console.log(data);

					convert(tempPath, data.duration, url, targetPath, function(err, results) {
						if (err) {console.log(err);}
						var data = [];
						// results is an array of files
						async.each(results, function(file, callback) {
							async.series([
								function(next) {
									var newFile = file.file;

									function fileExists(file) {
										if (fs.existsSync(file)) {
											console.log('file: ' + file);
											wit(file, function(err, result) {
												next(null, result);
											});
										} else {
											setTimeout(function() {
												// console.log('nope');
												fileExists(newFile);
											}, 500);
										}
									}

									fileExists(newFile);
								}
							], function(err, newResult) {
								data.push(JSON.parse(newResult[0]));
								if (data.length === results.length) {
									console.log(data);
								}
							});
						});
					});
				})
				.on('end', function() {
					return newFile;
				});
		}

		saveFile();
	},
	watson: function(req, res) {
		var saveFile = function() {
			var url = generateName(),
				tempPath = req.files.file.path,
				ext = path.extname(req.files.file.name).toLowerCase(),
				targetPath = path.resolve('public/upload/temp/' + url),
				newFile = targetPath + '.mp3';

			var command = FfmpegCommand(tempPath)
				.on('start', function(commandLine) {
					console.log('Extracting audio, please wait ... ');
				})
				.save(newFile)
				.on('end', function() {
					return newFile;
				});

		}
		saveFile();
	}
}