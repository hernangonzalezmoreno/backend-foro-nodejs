'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-node');
var User = require('../models/user');
var jwt = require('../services/jwt');

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
    user.password = params.password;
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

      // Comparamos las contrasenas
      bcrypt.compare( params.password, user.password, (err, check) => {

        if( err || !check ){
          return res.status(400).send({
            message: 'Error en las credenciales.'
          });
        }else{

          // Generamos el token con JWT
          let token = jwt.createToken( user );

          // Quitamos algunos parametros del usuario antes de enviar la respuesta
          user.password = undefined;

          return res.status(200).send({
            status: 'success',
            token: token,
            user
          });
        }

      });

    });

  },

  update: function (req, res){

    // Obtenemos los datos
    let params = req.body;

    // Validamos los datos
    let validate_name = params.name && !validator.isEmpty( params.name );
    let validate_surname = params.surname && !validator.isEmpty( params.surname );
    let validate_email = params.email && !validator.isEmpty( params.email ) && validator.isEmail( params.email );

    if( !validate_name || !validate_surname || !validate_email ){
      return res.status(400).send({
        message: 'Error en los datos.'
      });
    }

    // A minusculas
    params.email = params.email.toLowerCase();

    // Si cambio el email, debemos comprobar que el email no este siendo usado por otro usuario
    if( req.user.email != params.email ){
      // Comprobamos si el email ya existe en la base de datos
      User.findOne( { email: params.email }, (err, issetUser ) => {

        if( err ){
          return res.status(500).send({
            message: 'Error en la comprobación de email duplicado.'
          });
        }

        if( issetUser ){
          return res.status(500).send({
            message: 'Ese email ya esta registrado por otro usuario.'
          });
        }
      });
    }

    // Removemos los datos a no actualizar
    delete params.role;
    delete params.password;

    // Tomamos el id de usuario
    let user_id = req.user.sub;

    // Buscamos y actualizamos el documento
    // findOneAndUpdate 4 parametros:
    //    1) condicion/where
    //    2) los nuevos valores a guardar
    //    3) Opciones, con {new:true} indicamos que nos devuelva un nuevo objeto
    //    4) funcion de callback(err, userUpdated), respuesta de la actualizacion
    User.findOneAndUpdate( {_id: user_id}, params, {new:true}, (err, userUpdated) => {

      if( err ){
        return res.status(500).send({
          status: 'error',
          message: 'Error con la base de datos: ' + err
        });
      }

      if( !userUpdated ){
        return res.status(200).send({
          status: 'error',
          message: 'No se pudo actualizar el usuario.'
        });
      }

      // No devolvemos el password por seguridad
      userUpdated.password = undefined;

      return res.status(200).send({
        status: 'success',
        message: 'Usuario actualizado.',
        user: userUpdated
      });

    });

  }

};

module.exports = controller;
