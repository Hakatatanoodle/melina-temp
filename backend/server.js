'use strict';

/**
 * PetCare backend entry point.
 *
 * `server.js` only wires the application together: middleware, API routes and
 * the HTTP listener. Business logic lives in services, HTTP handling in
 * controllers, and JSON persistence in the storage layer.
 */

const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('./config');
const storage = require('./storage/json-storage');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const petsRoutes = require('./routes/pets.routes');
const healthRoutes = require('./routes/health.routes');
const uploadsRoutes = require('./routes/uploads.routes');

function createApp() {
  const app = express();

  app.use(express.json({ limit: '256kb' }));
  app.use(cookieParser());

  // Simple liveness endpoint for the frontend / demos.
  app.get('/api/health', (req, res) => {
    res.json({ success: true, data: { name: 'PetCare API', ok: true } });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/pets', petsRoutes);
  app.use('/api/health-records', healthRoutes);
  app.use('/api/uploads', uploadsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

function start() {
  storage.ensureDataFiles();

  const app = createApp();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[PetCare] backend listening on http://localhost:${config.port}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { createApp };
