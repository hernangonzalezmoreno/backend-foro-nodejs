'use strict'

var express = require('express');
var TopicController = require('../controllers/topic');

var router = express.Router();
var md_auth = require('../middlewares/authenticated.js');

router.post( '/save', md_auth.authenticated, TopicController.save );
router.get( '/get/topics/:page?', TopicController.getTopics );
router.get( '/user-topics/:user_id', TopicController.getTopicsByUser );
router.get( '/:topic_id', TopicController.getTopic );
router.get( '/search/:search_value', TopicController.search );
router.put( '/update/:topic_id', md_auth.authenticated, TopicController.update );
router.delete( '/:topic_id', md_auth.authenticated, TopicController.delete );

module.exports = router;
