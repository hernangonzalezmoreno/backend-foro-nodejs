'use strict'

// Requires
var express = require( 'express' );
var bodyParser = require( 'body-parser' );

// Ejecutar Express
var app = express();

// Cargar archivos de rutas
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');

// Middlewares
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( bodyParser.json() );

// CORS

// Reescribir rutas
app.use( '/api', user_routes );
app.use( '/api/topic', topic_routes );
app.use( '/api/comment', comment_routes );

// Exportar modulo
module.exports = app;
