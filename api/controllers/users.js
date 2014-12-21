var crypto = require('crypto');
var UsersModel = require('../models/user.js');

var MESSAGE_ERROR = "Un error ocurrió al intentar crear la cuenta.";
var SALT = 'jakDSkd·$ld_-`^"·àskd23`qañsd';

exports.registerAccount = function(req, res) {
	req.body.password = crypto.createHmac('sha1', SALT).update(req.body.password).digest('hex');
  var user = new UsersModel(req.body);

  UsersModel.findOne({username: user.username}, function(err, response) {
    if (err)
      res.send({success: false, message: MESSAGE_ERROR});
    else {
      if (response != null)
        res.send({success: false, message: "El usuario "+response.username+" ya existe."});
      else {
        UsersModel.findOne({email: user.email}, function(err, response) {
          if (err)
            res.send({success: false, message: MESSAGE_ERROR});
          else {
            if (response != null)
              res.send({success: false, message: "El email "+response.email+" ya existe."});
            else {
              user.save(function(err, response) {
                if (err)
                  res.send({success: false, message: MESSAGE_ERROR});
                else
                  res.send({success: true, message: "Usuario "+response.username+" creado con éxito."});
              });
            }
          }
        });
      }
    }
  }); 
};

exports.login = function(req, res) {
  UsersModel.findOne({username: req.body.username}, function(err, response) {
    if (err)
      res.send({success: false, message: "Ocurrió un error al intentar ingresar."});
    else {
      if (response != null) {
        req.body.password = crypto.createHmac('sha1', SALT).update(req.body.password).digest('hex');
        if (req.body.password == response.password) {
          response.password = "";
          res.send({success: true, user: response, message: "Login correcto."});
        }
        else
          res.send({success: false, message: "La contraseña no coincide."});
      }
      else
        res.send({success: false, message: "El usuario no existe."});
    }
  });
};