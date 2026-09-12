'use strict';

const healthService = require('../services/health.service');
const { sendSuccess } = require('../middleware/error.middleware');
const { asyncHandler } = require('../utils/http-error');

// GET /api/health-records — every record across the owner's pets
const list = asyncHandler(async (req, res) => {
  const records = await healthService.listForOwner(req.user.id);
  sendSuccess(res, 200, { records });
});

// GET /api/pets/:petId/health-records
const listForPet = asyncHandler(async (req, res) => {
  const records = await healthService.listForPet(req.user.id, req.params.petId);
  sendSuccess(res, 200, { records });
});

// POST /api/pets/:petId/health-records
const createForPet = asyncHandler(async (req, res) => {
  const record = await healthService.createForPet(req.user.id, req.params.petId, req.body || {});
  sendSuccess(res, 201, { record });
});

// PUT /api/health-records/:id
const update = asyncHandler(async (req, res) => {
  const record = await healthService.updateForOwner(req.user.id, req.params.id, req.body || {});
  sendSuccess(res, 200, { record });
});

// DELETE /api/health-records/:id
const remove = asyncHandler(async (req, res) => {
  await healthService.removeForOwner(req.user.id, req.params.id);
  sendSuccess(res, 200, { deleted: true });
});

module.exports = { list, listForPet, createForPet, update, remove };
