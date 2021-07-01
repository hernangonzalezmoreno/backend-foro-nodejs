'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

  save: function (req, res){

    // Recogemos los parametros del post gracias a la libreria body-parser
    let paramsPost = req.body;

    let validate_title = paramsPost.title && !validator.isEmpty( paramsPost.title );
    let validate_content = paramsPost.content && !validator.isEmpty( paramsPost.content );
    let validate_lang = paramsPost.lang && !validator.isEmpty( paramsPost.lang );

    if( !validate_title || !validate_content || !validate_lang ){
      return res.status(400).send({
        status: 'error',
        message: 'Datos no validos.'
      });
    }

    // Creamos el objeto Topic para guardar
    let topic = new Topic();
    topic.title = paramsPost.title;
    topic.content = paramsPost.content;
    topic.code = paramsPost.code;
    topic.lang = paramsPost.lang;
    topic.user = req.user.sub;

    // Guardamos el objeto
    topic.save( (err, topicStored) => {

      if( err || !topicStored){
        return res.status(500).send({
          status: 'error',
          message: err? 'Error al guardar en la base de datos.' : 'Error al crear el topic en la base de datos.'
        });
      }

      return res.status(200).send({
        status: 'success',
        topicStored
      });

    });

  },

  getTopics: function (req, res){

    // Tomamos el parametro de paginacion
    let page = 1;
    if( req.params.page && parseInt( req.params.page ) ){
      page = parseInt( req.params.page );
    }

    // Seteamos las opciones de paginacion
    const opciones = {
      sort: { date: -1 }, // 1 para ordenarlo de mas antiguo a mas nuevo, -1 de mas nuevo a mas antiguo
      populate: 'user', // Populamos el id guardado con el usuario que corresponda
      limit: 5, // El numero de entradas por pagina
      page: page
    }

    // Hacemos la consulta
    // Primer parametro condicion, segundo opciones, tercero callback
    Topic.paginate( {}, opciones, (err, result) => {

      if( err || !result ){
        return res.status( err? 500 : 404 ).send({
          status: 'error',
          message: err? 'Error en la consulta.' : 'No hay documentos.'
        });
      }

      return res.status( 200 ).send({
        status: 'success',
        topics: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages
      });

    });

  },

  getTopicsByUser: function (req, res){
    let user_id = req.params.user_id;

    Topic.find( {user: user_id} )
    .sort( [ ['date','descending'] ] ) // ordenamos de forma descendiente segun la fecha
    .exec( (err, topics) => {

      if( err || !topics ){
        return res.status( err? 500 : 404 ).send({
          status: 'error',
          message: err? 'Error al consultar los topics.' : 'Topics no encontrados.'
        });
      }

      return res.status(200).send({
        status: 'success',
        topics
      });

    });

  },

  getTopic: function (req, res){
    let topic_id = req.params.topic_id;

    Topic.findById( topic_id )
    .populate( 'user' )
    .exec( (err, topic) => {

      if( err || !topic ){
        return res.status( err? 500 : 404 ).send({
          status: 'error',
          message: err? 'Error al consultar el topic.' : 'Topic no encontrado.'
        });
      }

      return res.status(200).send({
        status: 'success',
        topic
      });

    });

  },

  update: function (req, res){
    let topic_id = req.params.topic_id;
    let user_id = req.user.sub;

    let body = req.body;

    // Validamos los datos
    let validate_title = body.title && !validator.isEmpty( body.title );
    let validate_content = body.content && !validator.isEmpty( body.content );
    let validate_lang = body.lang && !validator.isEmpty( body.lang );

    if( !validate_title || !validate_content || !validate_lang ){
      return res.status(400).send({
        status: 'error',
        message: 'Los datos no son validos.'
      });
    }

    // Contruimos el JSON para la actualizacion
    let datos = {
      title: body.title,
      content: body.content,
      code: body.code,
      lang: body.lang
    }

    // Actualizamos con el metodo findOneAndUpdate
    Topic.findOneAndUpdate( { _id: topic_id, user: user_id }, datos, {new: true}, (err, topic) => {

      if( err || !topic ){
        return res.status( err? 500 : 400 ).send({
          status: 'error',
          message: err? 'Error al actualizar el topic.' : 'No se pudo actualizar el topic.'
        });
      }

      return res.status(200).send({
        status: 'success',
        topic
      });

    });

  }

}

module.exports = controller;
