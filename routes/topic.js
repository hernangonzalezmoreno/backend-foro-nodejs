'use strict'

var express = require('express');
var TopicController = require('../controllers/topic');

var router = express.Router();
var md_auth = require('../middlewares/authenticated.js');

router.post( '/save', md_auth.authenticated, TopicController.save );

module.exports = router;