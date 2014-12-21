var express   = require('express'),
  app         = express(),
  http        = require('http'),
  server      = http.createServer(app),
  mongoose    = require('mongoose'),
  nodemailer  = require('nodemailer'),
  io          = require('socket.io').listen(7777),
  PORT        = 3000;

app.configure('dev', function() {
  app.use(express.static('../app'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
	app.use(express.methodOverride());
	var allowCrossDomain = function(req, res, next) { 	
      res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'x-requested-with, origin, content-type, accept, App, Auth');
      /*
      var APIKEY = '61965cce7314a88f5dd94e40b2c1b1f351e47c45';
      if (req.method != "OPTIONS") {
        if (req.header('Auth') !== APIKEY) {
          res.send(401);
        }
      }
      */
      next();
	};
	app.use(allowCrossDomain);
});

io.sockets.on('connection', function (socket) {
  socket.on('post', function(post) {
    socket.broadcast.emit('post', post);
  });
});

mongoose.connect('mongodb://127.0.0.1/blog', function(err, res) {
	if (err)
    console.log("ERROR: Connecting to DataBase. "+err);
	else
    console.log("Connected to DataBase!");
});

smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
      user: "",
      pass: ""
  }
});

require('./api')(app);

server.listen(PORT, function(err) {
  if (err)
    console.log(err);
  else {
    //var open = require('open');
    //open('http://127.0.0.1:'+PORT+'/');
    console.log("Node Server running on http://127.0.0.1:"+PORT);
  }
});