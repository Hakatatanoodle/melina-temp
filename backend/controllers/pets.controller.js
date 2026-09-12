'use strict';

const petsService = require('../services/pets.service');
const { sendSuccess } = require('../middleware/error.middleware');
const { asyncHandler } = require('../utils/http-error');

// GET /api/pets
const list = asyncHandler(async (req, res) => {
  const pets = await petsService.listForOwner(req.user.id);
  sendSuccess(res, 200, { pets });
});

// GET /api/pets/:id
const get = asyncHandler(async (req, res) => {
  const pet = await petsService.getForOwner(req.user.id, req.params.id);
  sendSuccess(res, 200, { pet });
});

// POST /api/pets
const create = asyncHandler(async (req, res) => {
  const pet = await petsService.createForOwner(req.user.id, req.body || {});
  sendSuccess(res, 201, { pet });
});

// PUT /api/pets/:id
const update = asyncHandler(async (req, res) => {
  const pet = await petsService.updateForOwner(req.user.id, req.params.id, req.body || {});
  sendSuccess(res, 200, { pet });
});

// DELETE /api/pets/:id
const remove = asyncHandler(async (req, res) => {
  await petsService.removeForOwner(req.user.id, req.params.id);
  sendSuccess(res, 200, { deleted: true });
});

module.exports = { list, get, create, update, remove };
