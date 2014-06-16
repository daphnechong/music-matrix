var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/web-audio-api.html');	
});

router.get('/sampleTone', function(req, res) {
	 res.header('Access-Control-Allow-Origin', '*');
	 res.sendfile(__dirname + '/public/tone.mp3');
});

app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);