'use strict'

var mongoose = require( 'mongoose' );

mongoose.Promise = global.Promise;
mongoose.connect( 'mongodb://localhost:27017/api_rest_forum', { useNewUrlParser: true, useUnifiedTopology: true } )
        .then( () => {
          console.log( "Conexión exitosa con la base de datos de mongo." );
        })
        .catch(
          error => console.log( error )
        );
