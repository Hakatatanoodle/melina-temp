'use strict';

const { Router } = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const healthController = require('../controllers/health.controller');

const router = Router();

router.use(requireAuth);

router.get('/', healthController.list);
router.put('/:id', healthController.update);
router.delete('/:id', healthController.remove);

module.exports = router;
