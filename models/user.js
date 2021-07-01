'use strict'

var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  image: String,
  role: String
});

// Sobreescribimos el metodo toJSON
// para que siempre que pidamos un usuario, no nos traiga la password
UserSchema.methods.toJSON = function (){
  let obj = this.toObject();
  delete obj.password;
  return obj;
}

module.exports = mongoose.model( 'User', UserSchema );
