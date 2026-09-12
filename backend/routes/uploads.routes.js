'use strict';

const { Router } = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const uploadsController = require('../controllers/uploads.controller');

const router = Router();

router.use(requireAuth);

router.post('/', uploadsController.uploadMiddleware, uploadsController.create);
router.get('/:owner/:file', uploadsController.get);

module.exports = router;