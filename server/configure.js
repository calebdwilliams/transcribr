// declare dependencies
var path = require('path'),
	routes = require('./routes'),
	exphbs = require('express3-handlebars'),
	express = require('express'),
	multer = require('multer'),
	cookieParser = require('cookie-parser'),
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	errorHandler = require('errorhandler');

// takes app from server.js and returns configured app
module.exports = function(app) {
	// configuration code

	// set handlebars as the default rendering engine
	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views') + '/layouts',
		partialsDir: [app.get('views') + '/partials'],
		// set handlebars helpers
		helpers: {
			timeago: function(timestamp) {
				return moment(timestamp).startOf('minute').fromNow();
			}
		}
	}).engine);

	app.set('view engine', 'handlebars');

	// set up middleware with connect
	app.use(morgan('dev'));
	app.use(multer({
		// uploadDir:path.join(__dirname, '../public/upload/temp')
		dest: path.join(__dirname, '../public/upload/temp')
	}));
	app.use(methodOverride());
	app.use(cookieParser('some-secret-value-here'));

	// initialize routes
	routes.initialize(app, new express.Router());


	app.use('/public/', express.static(path.join(__dirname, '../public')));

	if ('development' === app.get('env')) {
		app.use(errorHandler());
	}

	// initialize routes
	routes.initialize(app);

	return app;
}