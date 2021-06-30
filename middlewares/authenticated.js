'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var seed = '0000-semilla-secreta-del-token-0000';

exports.authenticated = function( req, res, next ){

  // Comprobamos si llega la autorizacion
  if( !req.headers.authorization ){
    return res.status( 403 ).send({
      message: 'La petición no tiene la cabecera de authorization.'
    });
  }

  // Tomamos el token y lo limpiamos de comillas simples o dobles que pueda tener
  let token = req.headers.authorization.replace( /['"]+/g, '' );

  // Utilizamos un try-catch por si la decodificacion falla por token invalido
  try{

    // Decodificamos el token
    var payload = jwt.decode( token, seed );

    // Comprobamos la fecha de expiracion
    if( payload.exp <= moment().unix() ){
      return res.status( 404 ).send({
        message: 'El token ha expirado.'
      });
    }

  }catch(ex){
    return res.status( 404 ).send({
      message: 'El token no es valido.'
    });
  }

  // Adjuntamos el usuario a la req
  req.user = payload;

  // Continuamos, el middleware paso correctamente
  next();
}
