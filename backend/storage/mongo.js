'use strict';

/**
 * MongoDB connection helper.
 *
 * Single shared MongoClient for the whole backend (and for the Vercel
 * serverless function, where module-level caching lets warm invocations reuse
 * the connection). Reads MONGODB_URI / MONGODB_DB from the environment.
 * When MONGODB_URI is unset the app falls back to local JSON storage —
 * see storage/index.js.
 */

const { MongoClient } = require('mongodb');

let clientPromise = null;

function isMongoEnabled() {
  return Boolean(process.env.MONGODB_URI);
}

function getClient() {
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    }).connect();
  }
  return clientPromise;
}

async function getDb() {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || 'petcare');
}

/** Ping + create the unique email index so duplicate registration is atomic. */
async function ensureDataFiles() {
  const db = await getDb();
  await db.command({ ping: 1 });
  await db.collection('users').createIndex({ emailLower: 1 }, { unique: true });
}

module.exports = { isMongoEnabled, getDb, ensureDataFiles };
