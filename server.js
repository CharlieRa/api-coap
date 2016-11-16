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
var cors = require('cors');
/**
* Models
*/
var User = require('./app/models/user');
var Mote = require('./app/models/mote');
var Network = require('./app/models/network');

app.use(cors());
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
mongoose.connect(config.databaseLocal);
var db = mongoose.connection;
db.on('error', function(err){
	return console.log(err);
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
// var commandsRouter = express.Router({mergeParams: true})



router.get('/', function(request, response) {
	response.json({ message: 'API CoAP' });
});

/**
* Ruta para crear usuarios nuevos
*/
router.post('/signup', function(request, response) {
  if (!request.body.username || !request.body.password) {
    res.status(400).json({success: false, msg: 'Porfavor indica un usuario y contraseña.'});
  } else {
    var newUser = new User({
      username: request.body.username,
      password: request.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
				/* Status 409 de 'Conflic' si el usuario ya existe */
        return response.status(409).json({success: false, msg: 'El usuario ya existe. Intente otro.'});
      }
			/* Estatus 201 de resoursce*/
      response.status(201).json({success: true, msg: 'Usuario creado exitosamente.'});
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
			response.status(400).json({ success: false, message: 'Authentication failed. Usuario no encontrado.' });
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
					response.status(400).json({ success: false, message: 'Authentication failed. Password erroneo.' });
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
	var token = request.body.token || request.query.token || request.headers['x-access-token'] || request.headers['authorization'].split(' ')[1];

	if (token) {
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
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
				response.status(404).send(err);
	    response.json(users);
	  });
	});

router.route('/users/:user_id')
	.get(function(request, response) {
		User.findById(request.params.user_id, function(err, user) {
			if (err)
				response.status(404).send(err);
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
* Networks Routes
*/

router.route('/networks')
	.get(function(request, response) {
	  Network.find().populate(['motes', 'users']).exec(function(err, network) {
			if (err)
				response.status(400).send(err);
	    response.json(network);
	  });
	})
	.post(function(request, response) {
		console.log(request.body);
		if (!request.body.name || !request.body.address || !request.body.panid) {
			console.log("nombre");
			response.status(400).json({success: false, msg: 'Debes indicar al menos un nombre, ubicacion(dirección) y un pan-id de la Red.'});
		} else {
			var newNetwork = new Network({
				name: request.body.name,
		    address: request.body.address,
		    panid: request.body.panid,
		    motes: request.body.motes,
		    users: request.body.users
			});

			newNetwork.save(function(err) {
				if (err) {
					/* Status 409 de 'Conflic' si el usuario ya existe */
					return response.status(409).json({success: false, msg: 'El la red ya existe. Intente otro nombre.'});
				}
				/* Estatus 201 de resoursce*/
				response.status(201).json({success: true, msg: 'Red creado exitosamente.'});
			});
		}
	});

router.route('/networks/:network_id')
	.get(function(request, response) {
		Network.findById(request.params.network_id, function(err, network) {
			if (err)
				response.send(err);
			response.json(network);
		});
	})
	.put(function(request, response) {
		Network.findById(request.params.network_id, function(err, network) {
			if (err)
				response.send(err);

			network.username = request.body.username;
			network.save(function(err) {
				if (err)
					response.send(err);
				console.log(network);
				response.json({ message: 'Network updated!' });
			});
		});
	})
	.delete(function(request, response) {
		Network.remove({
			_id: request.params.network_id
		}, function(err, network) {
			if (err)
				response.send(err);
			console.log(network);
			response.json({ message: 'Network Successfully deleted' });
		});
	});

/**
* Motes Routes
*/
router.route('/motes')
	.get(function(request, response) {
		Mote.find(function(err, motes) {
			if (err) {
				response.send(err);
				console.log("assas");
			}
	    response.json(motes);
	  });
	})
	.post(function(request, response) {

		var mote = new Mote();
		mote.name = request.body.name;
		mote.mac = request.body.mac;
		mote.panid = request.body.panid;
		// mote.id16b = request.body.id16b;
		mote.eui64 = request.body.eui64;
		mote.dagroot = false;
		mote.ipv6 = request.body.ipv6;
		mote.commands = request.body.commands;
		mote.commands = [];
		console.log(request.body);
		mote.save(function(err) {
			if (err)
				response.send(err);
			response.json({ message: 'Mote created!' });
		});

	});


router.route('/motes/:mote_ip')
	.get(function(request, response) {
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
				console.log(data[0]);
				console.log(data[1]);
				console.log(parseInt(data[0]));
				// var temp1 = (data[0] << 8) + data[1]
				// var temperatura1 =-46.86+175.72*temp1/65536
				// console.log(temp1);
				// console.log(temperatura1);
				// var hum1 = (data[0] << 8)+data[1]
				// console.log(hum1);
				// var humedad1 = -6.0+125.0 * hum1 / 65536
				// console.log(humedad1);
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

/**/

router.route('/motes/:mote_ip/commands')
.get(function(request, response){
	var mote_ip = request.params.mote_ip;
	// var mote_ip = 'bbbb::1415:92cc:0:2';
	console.log(mote_ip);
	var command = '.well-known/core';
	var req = coap.request("coap://["+mote_ip+"]/"+command);
	var errArray = [];
	req.on('error', function(err) {
		errArray.push(err);
		if(errArray.length >= 3) {
			response.status(400).json({ response: err });
		}
	});

	req.on('timeout', function (timeout) {
		console.log('timeout');
		response.json({ response: timeout });
	});

	req.on('response', function(res) {
		console.log("res: "+res);
		res.pipe(bl(function(err, data) {
			console.log("data: "+data);
			var dataResponse = trimNewlines(data.toString()).split(',');
			response.status(200).json({
				mote: mote_ip,
				query: command,
				response: dataResponse
			});
		 }));
	});
	req.end();
});

/**
* Rutas de los comandos de los nodos
*/
router.route('/motes/:mote_ip/commands/:command')
	.get(function(request, response) {
		var command = request.params.command;
		console.log(mote_ip);
		console.log(command);
		var req = coap.request("coap://["+mote_ip+"]/"+command);
		var errArray = [];
		req.on('error', function(err) {
			errArray.push(err);
			if(errArray.length >= 3) {
				response.status(400).json({ response: err });
			}
		});

		req.on('timeout', function (timeout) {
			response.status(503).json({ response: timeout });
		});

		req.on('response', function(res) {
			console.log("res: "+res);
			res.pipe(bl(function(err, data) {
				console.log("data: "+data);
				var dataResponse = trimNewlines(data.toString()).split(',');
				response.status(200).json({
					mote: mote_ip,
					query: command,
					response: dataResponse
				});
			 }));
		});
		req.end();
	})
	.post(function(request, response) {
		console.log(request.body);
		response.json({ message: 'User updated!' });
	})
	.put(function(request, response) {
		console.log(request.body);
		response.json({ message: 'User updated!' });
	});

	router.route('/lala', function() {
		console.log(data[0]);
		console.log(data[1]);
		console.log(parseInt(data[0]));
		// var temp1 = (data[0] << 8) + data[1]
		// var temperatura1 =-46.86+175.72*temp1/65536
		// console.log(temp1);
		// console.log(temperatura1);
		// var hum1 = (data[0] << 8)+data[1]
		// console.log(hum1);
		// var humedad1 = -6.0+125.0 * hum1 / 65536
		// console.log(humedad1);
		// if(err) {
		// 	console.log(err);
		// }
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
		response.json({ message: 'lala'})
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
