'use strict'

// Requires
var express = require( 'express' );
var bodyParser = require( 'body-parser' );

// Ejecutar Express
var app = express();

// Cargar archivos de rutas

// Middlewares
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( bodyParser.json() );

// CORS

// Reescribir rutas

// Rutas de prueba
app.get( '/prueba-texto', (req, res) => {
  return res.status(200).send( "<h1>Hola prueba-texto</h1>" );
});

app.get( '/prueba-json', (req, res) => {
  return res.status(200).send( {
    title: 'Prueba json',
    message: 'Hola json'
  } );
});

// Exportar modulo
module.exports = app;