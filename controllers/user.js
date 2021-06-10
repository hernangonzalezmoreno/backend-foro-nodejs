'use strict'

var controller = {

  probandoPorGet: function ( req, res ){
    return res.status(200).send({
      message: "Metodo probandoPorGet del controller user."
    });
  },

  probandoPorPost: function ( req, res ){
    return res.status(200).send({
      message: "Metodo probandoPorPost del controller user."
    });
  }

};

module.exports = controller;
