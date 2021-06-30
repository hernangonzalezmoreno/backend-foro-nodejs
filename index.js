'use strict'

var mongoose = require( 'mongoose' );
var app = require( './app' );
// Tomo el puerto si esta definido, o creo en el 3990
var port = process.env.PORT || 3990;

// Deshabilitamos el uso de FindAndModify en mongoose ya que esta deprecado
mongoose.set( 'useFindAndModify', false );

mongoose.Promise = global.Promise;
mongoose.connect( 'mongodb://localhost:27017/api_rest_forum', { useNewUrlParser: true, useUnifiedTopology: true } )
        .then( () => {
          console.log( "Conexión exitosa con la base de datos de mongo." );

          // Crear el servidor
          app.listen( port, () => {
            console.log( "Servidor corriendo en http://localhost:" + port );
          });

        })
        .catch(
          error => console.log( error )
        );
