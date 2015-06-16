'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/:hashtag', controller.twitterWatch);
router.get('/watch/:hashtag', controller.twitterContinueWatch);

module.exports = router;