'use strict';

const { Router } = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const controller = require('../controllers/auth.controller');

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);

// Session endpoints require a valid cookie.
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.me);

module.exports = router;
