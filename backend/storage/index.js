'use strict';

/**
 * Storage seam — the rest of the backend never imports json-storage or
 * mongo-store directly.
 *
 * When MONGODB_URI is set the app persists permanently in MongoDB Atlas
 * (works on Vercel serverless, local dev, anywhere). Otherwise it falls back
 * to the local JSON files so the project still runs offline with zero setup.
 *
 * All functions are async in both modes (the JSON side wraps its sync
 * implementation), so services use `await` uniformly and the controllers,
 * routes, middleware and ownership rules stay untouched.
 */

const mongo = require('./mongo');
const jsonStorage = require('./json-storage');
const mongoStore = require('./mongo-store');

function useMongo() {
  return mongo.isMongoEnabled();
}

function store() {
  return useMongo() ? mongoStore : jsonStorage;
}

async function ensureDataFiles() {
  if (useMongo()) {
    await mongoStore.ensureDataFiles();
  } else {
    jsonStorage.ensureDataFiles();
  }
}

function newId() {
  // Synchronous in both modes — no DB call needed.
  return jsonStorage.newId();
}

/* Users */
async function findUserByEmail(email) {
  if (useMongo()) return mongoStore.findUserByEmail(email);
  return jsonStorage.findUserByEmail(email);
}

async function findUserById(id) {
  if (useMongo()) return mongoStore.findUserById(id);
  return jsonStorage.findUserById(id);
}

async function addUser(user) {
  if (useMongo()) return mongoStore.addUser(user);
  return jsonStorage.addUser(user);
}

/* Pets */
async function findPetById(petId) {
  if (useMongo()) return mongoStore.findPetById(petId);
  return jsonStorage.findPetById(petId);
}

async function getPetsByOwner(ownerId) {
  if (useMongo()) return mongoStore.getPetsByOwner(ownerId);
  return jsonStorage.getPetsByOwner(ownerId);
}

async function addPet(pet) {
  if (useMongo()) return mongoStore.addPet(pet);
  return jsonStorage.addPet(pet);
}

async function updatePet(updatedPet) {
  if (useMongo()) return mongoStore.updatePet(updatedPet);
  return jsonStorage.updatePet(updatedPet);
}

async function deletePet(petId) {
  if (useMongo()) return mongoStore.deletePet(petId);
  return jsonStorage.deletePet(petId);
}

/* Health records */
async function findRecordById(recordId) {
  if (useMongo()) return mongoStore.findRecordById(recordId);
  return jsonStorage.findRecordById(recordId);
}

async function getRecordsByPet(petId) {
  if (useMongo()) return mongoStore.getRecordsByPet(petId);
  return jsonStorage.getRecordsByPet(petId);
}

async function addRecord(record) {
  if (useMongo()) return mongoStore.addRecord(record);
  return jsonStorage.addRecord(record);
}

async function updateRecord(updatedRecord) {
  if (useMongo()) return mongoStore.updateRecord(updatedRecord);
  return jsonStorage.updateRecord(updatedRecord);
}

async function deleteRecord(recordId) {
  if (useMongo()) return mongoStore.deleteRecord(recordId);
  return jsonStorage.deleteRecord(recordId);
}

async function deleteRecordsByPet(petId) {
  if (useMongo()) return mongoStore.deleteRecordsByPet(petId);
  return jsonStorage.deleteRecordsByPet(petId);
}

module.exports = {
  EMAIL_TAKEN: mongoStore.EMAIL_TAKEN,
  useMongo,
  ensureDataFiles,
  newId,
  findUserByEmail,
  findUserById,
  addUser,
  findPetById,
  getPetsByOwner,
  addPet,
  updatePet,
  deletePet,
  findRecordById,
  getRecordsByPet,
  addRecord,
  updateRecord,
  deleteRecord,
  deleteRecordsByPet,
};
