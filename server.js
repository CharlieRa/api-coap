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
var PythonShell = require('python-shell');
var async = require('async');
/**
* Models
*/
var User = require('./app/models/user');
var Mote = require('./app/models/mote');
var Network = require('./app/models/network');
var Packet = require('./app/models/packet');

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
	response.json({ success: true, message: 'API CoAP' });
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
      password: request.body.password,
			admin: request.body.admin
    });
    // save the user
    newUser.save(function(err, userCreated) {
      if (err) {
				/* Status 409 de 'Conflic' si el usuario ya existe */
        return response.status(409).json({success: false, msg: 'El usuario ya existe. Intente otro.'});
      }
			console.log(userCreated);
			/* Estatus 201 de resource*/
      response.status(201).json({
				success: true, message: 'Usuario creado exitosamente.', _id: userCreated._id
			});
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
	        response.status(200).json({
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
				request.user = decoded._doc;
				console.log(request.user.admin);
				if (!request.user.admin) {
					var userPath = "/users";
					if(request.method != "GET" || request['path'].indexOf(userPath) != -1) {
						return response.status(403).send({
							success: false,
							message: 'No tienes los permisos necesarios para esta accion.'
						});
					}
				}
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
* User Logged in Route
*/
router.route('/me')
.get(function(request, response) {
	response.status(200).json(request.user);
});

/**
* Users Routes
*/
router.route('/users')
	.get(function(request, response) {
		User.find().populate(['networks']).exec(function(err, users) {
			if (err)
				response.status(400).json({ success: false, message: err });
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
				response.status(404).json({ success: false, message: err });

			user.username = request.body.username;
			user.password = request.body.password;
			user.admin = request.body.admin;
			user.save(function(err) {
				if (err)
					response.status(400).json({ success: false, message: err });
				response.status(200).json({ success: true, message: 'Usuario actualizado correctamente' });
			});
		});
	})
	.delete(function(request, response) {
		User.remove({
			_id: request.params.user_id
		}, function(err, user) {
			if (err)
				response.status(404).json({ success: false, message: err });
			console.log(user);
			response.json({ success: true, message: 'Usuario eliminado' });
		});
	});

/**
* Networks Routes
*/

router.route('/networks')
	.get(function(request, response) {
	  Network.find().populate(['motes']).exec(function(err, network) {
			if (err)
				response.status(400).send(err);
				// User.find({ networks: {$elemMatch: { _id: network._id}} }).exec(function(err, user){

		 User.find().elemMatch('networks', {'networks.id': network._id}).exec(function(err, user){
			 console.log(user);
		 });
	    response.json(network);
	  });
	})
	.post(function(request, response) {
		console.log(request.body);
		if (!request.body.name || !request.body.address || !request.body.panid) {
			response.status(400).json({success: false, msg: 'Debes indicar al menos un nombre, ubicacion(dirección) y un pan-id de la Red.'});
		} else {
			var newNetwork = new Network({
				name: request.body.name,
		    address: request.body.address,
		    panid: request.body.panid,
		    motes: request.body.motes
			});

			newNetwork.save(function(err, network) {
				if (err) {
					/* Status 409 de 'Conflic' si el usuario ya existe */
					return response.status(409).json({success: false, msg: 'El la red ya existe. Intente otro nombre.'});
				}
				User.update({ "_id": { "$in": request.body.users } },{$push: { networks: network._id }}, function(err, users) {
					console.log(users);
				});
				/* Estatus 201 de resoursce*/
				response.status(201).json({success: true, msg: 'Red creado exitosamente.'});
			});
		}
	});

router.route('/networks/:network_id')
	.get(function(request, response) {
		Network.findById(request.params.network_id, function(err, network) {
			if (err)
				response.status(404).json({'success': false, message: err});
			response.json(network);
		});
	})
	.put(function(request, response) {
		Network.findById(request.params.network_id, function(err, network) {
			if (err)
				response.status(404).json({'success': false, message: err});

			network.username = request.body.username;
			network.save(function(err) {
				if (err)
					response.status(400).json({'success': false, message: err});
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
				response.status(400).json({'success': false, message: err});
			response.json({ message: 'Network Successfully deleted' });
		});
	});

/**
* Motes Routes
*/
router.route('/motes')
	.get(function(request, response) {
		if (!request.user.admin) {
			User.findById(request.user._id).populate('networks').exec(function(err, user) {
				if (err) {
					response.status(404).json({'success': false, message: err});
				}
				Network.findById(user.networks[0]._id).populate('motes').exec(function(err, network) {
					if (err) {
						response.status(404).json({'success': false, message: err});
					}
					response.json(network.motes);
				});
				// Network.populate(user.networks,{ "path": "motes" },function(err,output) {
				// 	if (err) throw err; // or do something
				// 		console.log(output);
				// });
				// async.forEach(user, function(item,callback) {
				// 		Network.populate(item.networks,{ "path": "motes" },function(err,output) {
				// 			if (err) throw err; // or do something
				// 				callback();
				// 		});
				// }, function(err) {
				// 		// console.log(user.network.motes);
				// 		// response.json(user);
				// 		response.json(user);
				// });
		    // response.json(motes);
		  });
		}else{
			Mote.find(function(err, motes) {
				if (err) {
					response.status(404).json({'success': false, message: err});
				}
		    response.json(motes);
		  });
		}

	})
	.post(function(request, response) {

		var mote = new Mote();
		mote.name = request.body.name;
		mote.mac = request.body.mac;
		mote.panid = request.body.panid;
		mote.eui64 = request.body.eui64;
		mote.dagroot = false;
		mote.ipv6 = request.body.ipv6;
		mote.commands = request.body.commands;
		mote.commands = [];
		mote.save(function(err) {
			if (err)
				response.status(400).json({'success': false, message: err});
			response.json({ message: 'Mote created!' });
		});

	});

router.route('/motes/:mote_ip')
	.get(function(request, response) {
		Mote.find({'ipv6': request.params.mote_ip}).exec(function(err, mote) {
			if (err)
				response.status(400).json({'success': false, message: err});
	    response.json(mote);
	  });
	})
	.put(function(request, response) {
		Mote.find({'ipv6': mote_ip}, function(err, mote) {
			if (err)
				response.status(404).json(err);

			mote.name = request.body.name;
			mote.mac = request.body.mac;
			mote.panid = request.body.panid;
			mote.eui64 = request.body.eui64;
			mote.dagroot = false;
			mote.ipv6 = request.body.ipv6;
			mote.commands = request.body.commands;
			mote.save(function(err) {
				if (err)
					response.status(400).json({'success': false, message: err});
				console.log(user);
				response.json({ message: 'User updated!' });
			});
		});
	})
	.delete(function(request, response) {
		Mote.remove({
			'ipv6': request.params.mote_ip
		}, function(err, mote) {
			if (err)
				response.status(404).json({'success': false, message: err});
			response.status(200).json({ success: true, message: 'Eliminado exitosamente' });
		});
	});

/**
* Commands Motes Routes
*/

router.route('/motes/:mote_ip/commands')
.get(function(request, response){
	var mote_ip = request.params.mote_ip;
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
		console.log(timeout);
		response.status(408).json({ success:false, message: timeout });
	});

	req.on('response', function(res) {
		res.pipe(bl(function(err, data) {
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

router.route('/motes/:mote_ip/commands/:command')
	.get(function(request, response) {
		var command = request.params.command;
		var mote_ip = request.params.mote_ip;
		var req = coap.request("coap://["+mote_ip+"]/"+command);
		var errArray = [];
		req.on('error', function(err) {
			errArray.push(err);
			if(errArray.length >= 3) {
				response.status(400).json({ response: err });
			}
		});

		req.on('timeout', function (timeout) {
			response.status(408).json({ response: timeout });
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

	/**
	* Rutas de los paquetes capturados
	*/
	router.route('/packets')
		.get(function(request, response) {
			Packet.find().exec(function(err, packets) {
				if (err)
					response.status(400).send(err);
		    response.json(packets);
		  });
		});



	/* Ruta especial para iniciar la captura de paquetes */
	router.route('/packets/start')
		.get(function(request, response) {
			PythonShell.run('liveCapture.py', function (err, results) {
				if (err)
					response.status(400).send(err);
			});
			response.json({success: true, message: 'Script capturando datos.'});
		});
	router.route('/packets/stop')
		.get(function(request, response) {
			PythonShell.run('liveCapture.py', function (err, results) {
				console.log(err);
				console.log(results);
				if (err)
					response.status(400).send(err);
			});
			response.json({success: true, message: 'Script capturando datos.'});
		});

	router.route('/packets/search')
		.get(function(request, response) {
			var queries = [''];
			console.log(request.query);
			var querys = ['layers', 'ipv6_src', 'ipv6_dst', 'panid'];
			if(request.query == 'layer'){

			}
			Packet.find({'layers': request.query.layer }).exec(function(err, packets) {
				if (err)
					response.status(400).send(err);
				response.json(packets);
			});
			// response.json({success: true, message: 'Script capturando datos.'});
		});

	// entrants.find({ pincode: { $ne: null } })

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
