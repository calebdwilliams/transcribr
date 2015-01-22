var home = require('../controllers/home'),
	video = require('../controllers/video');

module.exports.initialize = function(app, router) {
	app.get('/', home.index);
	app.get('/:name', function(req, res) {
		res.send('Hello, ' + req.params.name + '.');
	})

	// post routes here
	// app.post('/upload', video.upload); // works
	app.post('/upload', video.watson); // test
	app.post('/upload/audio', video.uploadAudio);
}