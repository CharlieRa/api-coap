// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var coap       = require('coap');
var bl         = require('bl')
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken');
var trimNewlines = require('trim-newlines');
var config = require('./config');

//==========
// Models require
var User = require('./app/models/user');
app.use(morgan('dev')); // log requests to the console

/**
* Configure body parser
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8888; // set our port

mongoose.connect(config.database, function(err) {
	if(err) throw err;
  console.log('Successfully connected to MongoDB');
});

/**
* Set de variable secreta para hash de password
*/
app.set('superSecret', config.secret);

// var Bear     = require('./app/models/bear');

/**
* Rutas de la API
*/
// =============================================================================

// create our router
var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

router.post('/auth', function(req, res) {
  // find the user
  User.findOne({ username: req.body.username }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

			// test a matching password
			user.comparePassword(req.body.password, function(err, isMatch) {
				if (err) throw err;
				console.log(isMatch); // -&gt; Password123: true
				if(isMatch) {
	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign(user, app.get('superSecret'), {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
				}else{
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				}
			});

      // check if password matches
      // if (user.password != req.body.password) {
      //   res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      // } else {
			//
      //   // if user is found and password is right
      //   // create a token
      //   var token = jwt.sign(user, app.get('superSecret'), {
      //     expiresInMinutes: 1440 // expires in 24 hours
      //   });
			//
      //   // return the information including token as JSON
      //   res.json({
      //     success: true,
      //     message: 'Enjoy your token!',
      //     token: token
      //   });
      // }
    }

  });
});

/**
* Middleware to use for all requests
*/
router.use(function(req, res, next) {
	console.log('Something is happening.');
	// next();

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
				success: false,
				message: 'No token provided.'
		});

	}
});


// on routes that end in /bears
// ----------------------------------------------------
// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/motes')
	.get(function(request, response) {
 // 	var coapConnection = {
 //  host: 'localhost',
 //  pathname: '/yo',
 //  method: 'GET',
 //  confirmable: true
 // }
 // var req = coap.request(coapConnection)
			var req = coap.request("coap://[bbbb::1415:92cc:0:2]/i");
			// console.log(req);
			var dataResponse;
			req.on('response', function(res) {
				res.pipe(bl(function(err, data) {
					// console.log(data.toString());
					// console.log(trimNewlines(data.toString()));
					 dataResponse = trimNewlines(data.toString());
				 }));
			});
			req.end();
			// var json = JSON.parse(dataResponse);
			// console.log(json);
			console.log(dataResponse);
			response.json({ response: 'yes' });
			});

/**
* User Api Routes def
*/
router.route('/users')
	.get(function(req, res) {
	  User.find(function(err, users) {
	    res.json(users);
	  });
	});

router.route('/bears')
	.post(function(req, res) {

		var bear = new Bear();		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});

	})

	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);

			res.json(bears);
		});
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

	// get the bear with that id
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	// update the bear with this id
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
