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
    
  }

}

module.exports = controller;
