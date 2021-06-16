'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-node');
var User = require('../models/user');

var controller = {

  save: function (req, res){

    // Recibimos los parametros de la peticion
    let params = req.body;

    // Validamos los datos
    let validate_name = params.name && !validator.isEmpty( params.name );
    let validate_surname = params.surname && !validator.isEmpty( params.surname );
    let validate_email = params.email && !validator.isEmpty( params.email ) && validator.isEmail( params.email );
    let validate_password = params.password && !validator.isEmpty( params.password );

    if( !validate_name || !validate_surname || !validate_email || !validate_password ){
      return res.status(400).send({
        message: 'Error en los datos.'
      });
    }

    // Creacion del objeto usuario
    let user = new User();
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email.toLowerCase();
    user.image = null;
    user.role = 'ROLE_USER';

    // Comprobamos si el email ya existe en la base de datos
    User.findOne( { email: user.email }, (err, issetUser ) => {

      if( err ){
        return res.status(500).send({
          message: 'Error en la comprobación de usuario duplicado.'
        });
      }

      if( issetUser ){
        return res.status(400).send({
          message: 'El usuario ya esta registrado.'
        });
      }

      bcrypt.hash( user.password, null, null, (err, hash) => {

        if( err ){
          return res.status(400).send({
            message: 'Error en la encriptación.'
          });
        }

        user.password = hash;

        user.save( (err, userStored) => {

          if( err || !userStored ){
            return res.status( err? 500 : 400 ).send({
              message: 'Error al guardar el usuario.'
            });
          }

          return res.status(200).send({
            status: 'success',
            message: "Usuario registrado.",
            user
          });

        });

      });

    });

  },

  login: function (req, res){

    // Recibimos los parametros de la peticion
    let params = req.body;

    // Validamos los datos
    let validate_email = params.email && !validator.isEmpty( params.email ) && validator.isEmail( params.email );
    let validate_password = params.password && !validator.isEmpty( params.password );

    if( !validate_email || !validate_password ){
      return res.status(400).send({
        message: 'Error en los datos.'
      });
    }

    // Buscamos al usuario en la Base de Datos
    User.findOne( {email: params.email.toLowerCase()}, ( err, user ) => {

      if( err ){
        return res.status(500).send({
          message: 'Error en la consulta a la base de datos.'
        });
      }

      if( !user ){
        return res.status(404).send({
          message: 'El usuario no existe o hay un error en los datos introducidos.'
        });
      }

      // DEBUG: En este momento el metodo compare de bcrypt no esta funcionando
      console.log( "Pass: " + params.password );
      console.log( "User: " + user.password );

      // Comparamos las contrasenas
      bcrypt.compare( params.password, user.password, (err, check) => {

        if( err || !check ){
          return res.status(400).send({
            message: 'Error en las credenciales.'
          });
        }else{

          // Quitamos algunos parametros del usuario antes de enviar la respuesta
          user.password = undefined;

          return res.status(200).send({
            status: 'success',
            user
          });
        }

      });

    });

  }

};

module.exports = controller;
