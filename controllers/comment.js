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
    let user_id = req.user.sub;
    let comment_id = req.params.comment_id;
    let body = req.body;

    // Validamos los datos
    let validate_content = body.content && !validator.isEmpty( body.content );

    if( !validate_content ){
      return res.status(400).send({
        status: 'error',
        message: 'Los datos no son validos.'
      });
    }

    // Actualizamos un subdocumento del topic
    // Faltaria asegurarse que el comentario le pertenece al usuario autentificado
    Topic.findOneAndUpdate(
      { 'comments._id': comment_id },
      {
        '$set': {
          'comments.$.content': body.content
        }
      },
      { new: true },
      (err, topicUpdated) => {

        if( err || !topicUpdated ){
          return res.status( err? 500 : 404).send({
            status: 'error',
            message: err? 'Error al actualizar el comentario.' : 'No se pudo actualizar el comentario.'
          });
        }

        return res.status(200).send({
          status: 'success',
          topicUpdated
        });

      }
    );

  },

  delete: function(req, res){
    let user_id = req.user.sub;
    let topic_id = req.params.topic_id;
    let comment_id = req.params.comment_id;

    // Buscamos el topic
    Topic.findById( topic_id, (err, topic) => {

      if( err || !topic ){
        return res.status( err? 500 : 404 ).send({
          status: 'error',
          message: err? 'Error al buscar el topic.' : 'No se encontro el topic.'
        });
      }

      // Tomamos el comentario
      let comment = topic.comments.id( comment_id );

      // Comprobamos que exista el comentario y que le pertenezca al usuario autentificado
      if( !comment || comment.user != user_id ){
        return res.status( !comment? 404 : 403).send({
          status: 'error',
          message: !comment? 'No se encontro el comentario.' : 'No tiene permisos para eliminar el comentario.'
        });
      }

      // Eliminamos el comentario
      comment.remove();

      // Salvamos los cambios
      topic.save( err => {

        if( err ){
          return res.status(500).send({
            status: 'error',
            message: 'Error al borrar el comentario.'
          });
        }

        return res.status(200).send({
          status: 'success',
          topic
        });

      });

    });

  }

};

module.exports = controller;
