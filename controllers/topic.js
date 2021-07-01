'use strict'

var controller = {
  test: function (req, res){
    res.status(200).send({
      message: 'Ruta de prueba topic'
    });
  }
}

module.exports = controller;
