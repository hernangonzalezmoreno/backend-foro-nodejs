'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated.js');

var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './uploads/users' });

router.post( '/register', UserController.save );
router.post( '/login', UserController.login );
router.put( '/update', md_auth.authenticated, UserController.update );
router.post( '/upload-avatar', [md_auth.authenticated, md_upload], UserController.uploadAvatar );

module.exports = router;
