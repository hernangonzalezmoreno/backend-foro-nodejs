'use strict'

var validator = require('validator');
var Topic = require( '../models/topic' );

var controller = {

  add: function(req, res){
    let user_id = req.user.sub;
    let topic_id = req.params.topic_id;
    let body = req.body;

    // Validamos los datos
    let validate_content = body.content && !validator.isEmpty( body.content );

    if( !validate_content ){
      return res.status(400).send({
        status: 'error',
        message: 'Los datos no son validos.'
      });
    }

    // Obtenemos el Topic
    Topic.findById( topic_id ).exec( (err, topic) => {

      if( err || !topic ){
        return res.status( err? 500 : 404 ).send({
          status: 'error',
          message: err? 'Error al obtener el topic.' : 'Topic no encontrado.'
        });
      }

      // Creamos el objeto Comment
      let comment = {
        user: user_id,
        content: body.content
      }

      // Agregamos el Comment al Topic
      topic.comments.push( comment ); // como es un array contiene le metodo push()

      // Actualizamos la base de datos
      topic.save( err => {

        if( err ){
          return res.status(500).send({
            status: 'error',
            message: 'Error al guardar el comentario.'
          });
        }

        return res.status(200).send({
          status: 'success',
          topic
        });

      });

    });

  },

  update: function(req, res){

  },

  delete: function(req, res){

  }

};

module.exports = controller;
