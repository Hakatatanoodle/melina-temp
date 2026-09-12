'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Uploaded-image file storage.
 *
 * Keeps the file system isolated from the rest of the app, mirroring the
 * JSON storage philosophy: services only ever deal with paths and buffers,
 * never raw fs calls. Files live under `backend/data/uploads/<userId>/` and
 * are referenced by pets via `/api/uploads/<userId>/<filename>`.
 */

const UPLOADS_DIR = path.join(__dirname, '..', 'data', 'uploads');
const SAFE_FILENAME = /^[0-9a-f-]{36}\.(jpg|jpeg|png|webp|gif)$/i;
const UPLOAD_URL = /^\/api\/uploads\/([0-9a-fA-F-]{36})\/([0-9a-fA-F-]{36}\.(?:jpg|jpeg|png|webp|gif))$/;

function dirForUser(userId) {
  return path.join(UPLOADS_DIR, userId);
}

function saveImage(userId, extension, buffer) {
  fs.mkdirSync(dirForUser(userId), { recursive: true });
  const filename = `${crypto.randomUUID()}.${extension}`;
  fs.writeFileSync(path.join(dirForUser(userId), filename), buffer);
  return filename;
}

/** Parse `/api/uploads/<owner>/<file>` -> { ownerId, filename } or null. */
function parseUploadUrl(imageUrl) {
  const match = UPLOAD_URL.exec(imageUrl || '');
  if (!match) return null;
  return { ownerId: match[1], filename: match[2] };
}

/** Absolute path for an owner's upload, or null when unsafe/missing. */
function resolveImage(ownerId, filename) {
  if (!SAFE_FILENAME.test(filename)) return null;
  const dir = dirForUser(ownerId);
  const filePath = path.join(dir, filename);
  // Defence in depth: the resolved path must sit directly in the owner's folder.
  if (path.dirname(filePath) !== dir) return null;
  if (!fs.existsSync(filePath)) return null;
  return filePath;
}

function deleteImage(ownerId, filename) {
  if (!SAFE_FILENAME.test(filename)) return false;
  const filePath = path.join(dirForUser(ownerId), filename);
  if (path.dirname(filePath) !== dirForUser(ownerId)) return false;
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

function clearAll() {
  if (!fs.existsSync(UPLOADS_DIR)) return;
  for (const entry of fs.readdirSync(UPLOADS_DIR, { withFileTypes: true })) {
    if (entry.isDirectory()) fs.rmSync(path.join(UPLOADS_DIR, entry.name), { recursive: true, force: true });
  }
}

module.exports = {
  UPLOADS_DIR,
  saveImage,
  parseUploadUrl,
  resolveImage,
  deleteImage,
  clearAll,
};