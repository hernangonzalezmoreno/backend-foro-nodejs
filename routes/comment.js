'use strict'

var express = require('express');
var CommentController = require('../controllers/comment');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.post( '/add/:topic_id', md_auth.authenticated, CommentController.add );
router.put( '/update/:comment_id', md_auth.authenticated, CommentController.update );
router.delete( '/delete/:topic_id/:comment_id', md_auth.authenticated, CommentController.delete );

module.exports = router;
