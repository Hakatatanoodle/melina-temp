'use strict';

const { Router } = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const petsController = require('../controllers/pets.controller');
const healthController = require('../controllers/health.controller');

const router = Router();

router.use(requireAuth);

// Pet CRUD
router.get('/', petsController.list);
router.post('/', petsController.create);
router.get('/:id', petsController.get);
router.put('/:id', petsController.update);
router.delete('/:id', petsController.remove);

// Health-record subresource of a pet
router.get('/:petId/health-records', healthController.listForPet);
router.post('/:petId/health-records', healthController.createForPet);

module.exports = router;
