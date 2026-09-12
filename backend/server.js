'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('./config');
const storage = require('./storage');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const petsRoutes = require('./routes/pets.routes');
const healthRoutes = require('./routes/health.routes');
const uploadsRoutes = require('./routes/uploads.routes');

function createApp() {
  const app = express();

  app.use(express.json({ limit: '256kb' }));
  app.use(cookieParser());

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

const app = createApp();

if (require.main === module) {
  storage
    .ensureDataFiles()
    .then(() => {
      app.listen(config.port, () => {
        console.log(`[PetCare] backend listening on http://localhost:${config.port}`);
      });
    })
    .catch((err) => {
      console.error('[PetCare] could not connect to the database:', err.message);
      process.exit(1);
    });
}

module.exports = app;
