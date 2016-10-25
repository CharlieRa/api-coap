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

/**
* Models
*/
var User = require('./app/models/user');
// var Bear     = require('./app/models/bear');


/**
* Log requests to the console
*/
app.use(morgan('dev'));

/**
* Configure body parser
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;

/**
* Connect to database
*/
mongoose.connect(config.databaseLocal , function(err) {
	if(err) throw err;
  console.log('Successfully connected to MongoDB');
});

/**
* Set de variable secreta para hash de password
*/
app.set('superSecret', config.secret);

/**
* Rutas de la API
*/
// =============================================================================

/* Craendo nuestro Router */
var router = express.Router();

router.get('/', function(request, response) {
	response.json({ message: 'hooray! welcome to our api!' });
});

/**
* Ruta para crear usuarios nuevos
*/
router.post('/signup', function(request, response) {
	console.log(request.body);
  if (!request.body.username || !request.body.password) {
    res.json({success: false, msg: 'Please give a username and password.'});
  } else {
    var newUser = new User({
      username: request.body.username,
      password: request.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return response.json({success: false, msg: 'Username already exists.'});
      }
      response.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

/**
* Ruta para autenticar usuarios
*/
router.post('/auth', function(request, response) {
  User.findOne({ username: request.body.username }, function(err, user) {
    if (err) throw err;

    if (!user) {
      response.json({ success: false, message: 'Authentication failed. Usuario no encontrado.' });
    } else if (user) {
			/* Comparacion de passwords */
			user.comparePassword(request.body.password, function(err, isMatch) {
				if (err) throw err;
				if(isMatch) {
	        // if user is found and password is right, create a token
	        var token = jwt.sign(user, app.get('superSecret'), {
						expiresIn : 60*60*24 /* En segundos */
	        });

	        // return the information including token as JSON
	        response.json({
	          success: true,
	          token: token
	        });
				}else{
					response.json({ success: false, message: 'Authentication failed. Password erroneo.' });
				}
			});
    }
  });
});

/**
* Middleware de verificacion de token
*/
router.use(function(request, response, next) {

	/* Check del token en header */
	var token = request.body.token || request.query.token || request.headers['x-access-token'];

	if (token) {
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				console.log(err);
				return response.json({ success: false, message: 'Error al autenticar el token. Mensaje: '+err['message'] });
			} else {
				request.decoded = decoded;
				next();
			}
		});

	} else {
		return response.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

/**
* Users Routes
*/
router.route('/users')
	.get(function(request, response) {
	  User.find(function(err, users) {
			if (err)
				response.send(err);
	    response.json(users);
	  });
	});

router.route('/users/:user_id')
	.get(function(request, response) {
		User.findById(request.params.user_id, function(err, user) {
			if (err)
				response.send(err);
			response.json(user);
		});
	})
		.put(function(request, response) {
			User.findById(request.params.user_id, function(err, user) {
				if (err)
					response.send(err);

				user.username = request.body.username;
				user.save(function(err) {
					if (err)
						response.send(err);
					console.log(user);
					response.json({ message: 'User updated!' });
				});
			});
		})
	.delete(function(request, response) {
		User.remove({
			_id: request.params.user_id
		}, function(err, user) {
			if (err)
				response.send(err);
			console.log(user);
			response.json({ message: 'Successfully deleted' });
		});
	});

/**
* Motes Routes
*/
router.route('/motes')
	.get(function(request, response) {
		// var req = coap.request("coap://[bbbb::12:4b00:3a5:6b3c]/i");
		var req = coap.request("coap://[bbbb::12:4b00:3a5:6b3c]/root");
		var dataResponse;
		console.log(req.status);
		req.on('error', function(err) {
	    console.log(err);
			// req.end();
			// return;
			// console.log(req);
			response.json({ response: 'error' });
		});
		req.on('timeout', function () {
		  // Timeout happend. Server received request, but not handled it
		  // (i.e. doesn't send any response or it took to long).
		  // You don't know what happend.
		  // It will emit 'error' message as well (with ECONNRESET code).
			response.json({ response: 'timeout' });
		  console.log('timeout');
		});
		req.on('response', function(res) {
			console.log("res: "+res);
			if(!res) {
				console.log("not respond");
			}
			res.pipe(bl(function(err, data) {
				console.log("err: "+err);
				console.log("data: "+data);
				// if(err) {
				// 	console.log(err);
				// }
				response.json({ response: 'yes' });
				 dataResponse = trimNewlines(data.toString());
			 }));
		});
		req.end();
		// var json = JSON.parse(dataResponse);
		// console.log(json);
		// console.log(dataResponse);
		// response.json({ response: 'yes' });
	});

router.route('/motes/:mote_ip')
	.get(function(request, response) {
		// var commandList = {};
		var commandList = {
			'root': 'root',
			'info': 'i',
			'temperature': 'temp',
			'humidity': 'hum',
		};
		// commandList['root'] = 'root';
		console.log(request.params.mote_ip);
		console.log(request.query.command);
		var command = request.query.command;
		if(!(command in commandList)){
			response.json({ response: 'Comando invalido. Lista de comandos disponibles: ' });
			return;
		}
		if(!request.query.command){
			response.json({ response: 'Debe indicar un comando' });
			return;
		}
		// var mote_ip = "bbbb::12:4b00:3a5:6b3c";
		var mote_ip = request.params.mote_ip;
		// var req = coap.request("coap://["+request.params.mote_ip+"]/root");

		var req = coap.request("coap://["+mote_ip+"]/"+commandList[command]+"");
		// var req = coap.request("coap://[bbbb::12:4b00:3a5:6b3c]/root");
		req.on('error', function(err) {
			console.log(err);
			response.json({ response: 'error' });
		});

		req.on('timeout', function () {
			response.json({ response: 'timeout' });
			console.log('timeout');
		});

		req.on('response', function(res) {
			console.log("res: "+res);
			if(!res) {
				console.log("not respond");
			}
			res.pipe(bl(function(err, data) {
				console.log("err: "+err);
				console.log("data: "+data);
				// if(err) {
				// 	console.log(err);
				// }
				response.json({ response: 'yes' });
				 dataResponse = trimNewlines(data.toString());
			 }));
		});
		req.end();
	})
	.put(function(request, response) {
		User.findById(req.params.user_id, function(err, user) {
			if (err)
				response.send(err);

			user.username = request.body.username;
			user.save(function(err) {
				if (err)
					response.send(err);
				console.log(user);
				response.json({ message: 'User updated!' });
			});
		});
	})
	.delete(function(request, response) {
		User.remove({
			_id: request.params.user_id
		}, function(err, user) {
			if (err)
				response.send(err);
			console.log(user);
			response.json({ message: 'Successfully deleted' });
		});
	});

/**
* Registro de las rutas
*/
app.use('/api', router);

/**
* Inicio del Servidor
*/
app.listen(port);
console.log('Servidor levantado en el puerto' + port);
