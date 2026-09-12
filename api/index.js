'use strict';

/**
 * Vercel serverless entry point.
 *
 * Vercel mounts `api/index.js` at the `/api` path, so the Express app is
 * wired using route prefixes WITHOUT the `/api` part (they become
 * `/api/auth`, `/api/pets`, … externally — exactly what the frontend calls).
 * This is only used by the hosted deployment; local development runs the
 * regular `backend/server.js` on :4000.
 */

require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const storage = require('../backend/storage/json-storage');
const { notFoundHandler, errorHandler } = require('../backend/middleware/error.middleware');
const authRoutes = require('../backend/routes/auth.routes');
const petsRoutes = require('../backend/routes/pets.routes');
const healthRoutes = require('../backend/routes/health.routes');
const uploadsRoutes = require('../backend/routes/uploads.routes');

storage.ensureDataFiles();

const app = express();

app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ success: true, data: { name: 'PetCare API', ok: true } });
});

app.use('/auth', authRoutes);
app.use('/pets', petsRoutes);
app.use('/health-records', healthRoutes);
app.use('/uploads', uploadsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;