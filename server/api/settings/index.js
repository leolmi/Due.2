/**
 * Created by Leo on 23/06/2015.
 */
'use strict';

var express = require('express');
var controller = require('./settings.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.show);
router.put('/', auth.isAuthenticated(), controller.update);

module.exports = router;
