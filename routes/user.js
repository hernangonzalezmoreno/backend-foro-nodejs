'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

router.get( '/usuario-probando', UserController.probandoPorGet );
router.post( '/usuario-probando', UserController.probandoPorPost );

module.exports = router;
