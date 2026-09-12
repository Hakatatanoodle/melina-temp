'use strict';

const storage = require('../storage/uploads');
const { HttpError } = require('../utils/http-error');

/**
 * Upload business logic: whitelists image types, verifies the file magic
 * (not just the client's claimed MIME type), and caps the size.
 */

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const IMAGE_TYPES = {
  'image/jpeg': { ext: 'jpg', magic: [0xff, 0xd8, 0xff] },
  'image/png': { ext: 'png', magic: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  'image/webp': { ext: 'webp', magic: [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50] }, // "RIFF".."WEBP"
  'image/gif': { ext: 'gif', magic: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // "GIF89a"
};

function detectExtension(buffer, mimetype) {
  const type = IMAGE_TYPES[mimetype];
  if (!type) {
    throw new HttpError(415, 'Please upload a JPG, PNG, WebP or GIF image.');
  }
  const headerOk = type.magic.every((byte, index) => buffer[index] === byte);
  if (!headerOk) {
    throw new HttpError(415, 'That file does not look like an image.');
  }
  return type.ext;
}

function saveImage(userId, buffer, mimetype) {
  if (!buffer || buffer.length === 0) {
    throw new HttpError(400, 'Choose a photo to upload.');
  }
  if (buffer.length > MAX_BYTES) {
    throw new HttpError(413, 'Photo must be 5 MB or smaller.');
  }
  const extension = detectExtension(buffer, mimetype);
  const filename = storage.saveImage(userId, extension, buffer);
  return filename;
}

function getFile(ownerId, filename) {
  const filePath = storage.resolveImage(ownerId, filename);
  if (!filePath) {
    throw new HttpError(404, 'Image not found.');
  }
  return filePath;
}

module.exports = {
  MAX_BYTES,
  saveImage,
  getFile,
};