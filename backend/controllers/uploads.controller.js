'use strict';

const multer = require('multer');

const uploadsService = require('../services/uploads.service');
const { sendSuccess } = require('../middleware/error.middleware');
const { HttpError, asyncHandler } = require('../utils/http-error');

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: uploadsService.MAX_BYTES + 1024 * 1024, files: 1 }, // field limit slightly above the service cap
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new HttpError(415, 'Please upload an image file.'));
  },
}).single('photo');

// POST /api/uploads  (multipart field name: "photo")
const create = asyncHandler(async (req, res) => {
  const { buffer, mimetype } = req.file || {};
  const filename = uploadsService.saveImage(req.user.id, buffer, mimetype);
  sendSuccess(res, 201, { path: `/api/uploads/${req.user.id}/${filename}` });
});

// GET /api/uploads/:owner/:file
const get = asyncHandler(async (req, res) => {
  // Uploads are private to their owner — foreign ids look like 404s.
  if (req.params.owner !== req.user.id) {
    throw new HttpError(404, 'Image not found.');
  }
  const filePath = uploadsService.getFile(req.user.id, req.params.file);
  res.sendFile(filePath);
});

module.exports = { uploadMiddleware, create, get };