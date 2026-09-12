'use strict';

/* eslint-disable no-console */

/**
 * Mongo-backed store.
 *
 * Same record shapes as the JSON store (plain objects with `id`,
 * `createdAt`/`updatedAt`, camelCase fields). Email uniqueness relies on a
 * unique index on `emailLower`; a duplicate-key error is converted to the
 * same EMAIL_TAKEN marker the services layer turns into a 409.
 */

const crypto = require('crypto');
const mongo = require('./mongo');

const EMAIL_TAKEN = 'EMAIL_TAKEN';

const coll = {
  USERS: 'users',
  PETS: 'pets',
  RECORDS: 'health_records',
};

async function ensureDataFiles() {
  await mongo.ensureDataFiles();
}

function newId() {
  return crypto.randomUUID();
}

function mapMongo(doc) {
  if (!doc) return null;
  const { _id, emailLower, ...rest } = doc;
  return rest;
}

function errorMarker(err) {
  if (err && (err.code === 11000 || String(err.message || '').includes('E11000'))) {
    return EMAIL_TAKEN;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

async function findUserByEmail(email) {
  const db = await mongo.getDb();
  const normalized = String(email || '').trim().toLowerCase();
  const doc = await db.collection(coll.USERS).findOne({ emailLower: normalized });
  return mapMongo(doc);
}

async function findUserById(id) {
  const db = await mongo.getDb();
  const doc = await db.collection(coll.USERS).findOne({ id });
  return mapMongo(doc);
}

/** Throws a marked error when the email already exists — atomic via the index. */
async function addUser({ fullName, email, passwordHash }) {
  const db = await mongo.getDb();
  const user = {
    id: newId(),
    fullName,
    email,
    emailLower: String(email || '').toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  try {
    await db.collection(coll.USERS).insertOne(user);
  } catch (err) {
    if (errorMarker(err) === EMAIL_TAKEN) {
      const taken = new Error('Email already registered.');
      taken.code = EMAIL_TAKEN;
      throw taken;
    }
    throw err;
  }
  return user;
}

/* ------------------------------------------------------------------ */
/* Pets                                                                */
/* ------------------------------------------------------------------ */

async function findPetById(petId) {
  const db = await mongo.getDb();
  const doc = await db.collection(coll.PETS).findOne({ id: petId });
  return mapMongo(doc);
}

async function getPetsByOwner(ownerId) {
  const db = await mongo.getDb();
  const docs = await db
    .collection(coll.PETS)
    .find({ ownerId })
    .sort({ createdAt: 1 })
    .toArray();
  return docs.map(mapMongo);
}

async function addPet(pet) {
  const db = await mongo.getDb();
  await db.collection(coll.PETS).insertOne({ ...pet });
  return pet;
}

async function updatePet(updatedPet) {
  const db = await mongo.getDb();
  const res = await db
    .collection(coll.PETS)
    .findOneAndUpdate({ id: updatedPet.id }, { $set: { ...updatedPet } }, { returnDocument: 'after' });
  return res && res.value ? mapMongo(res.value) : null;
}

async function deletePet(petId) {
  const db = await mongo.getDb();
  const res = await db.collection(coll.PETS).deleteOne({ id: petId });
  return res.deletedCount > 0;
}

/* ------------------------------------------------------------------ */
/* Health records                                                      */
/* ------------------------------------------------------------------ */

async function findRecordById(recordId) {
  const db = await mongo.getDb();
  const doc = await db.collection(coll.RECORDS).findOne({ id: recordId });
  return mapMongo(doc);
}

async function getRecordsByPet(petId) {
  const db = await mongo.getDb();
  const docs = await db
    .collection(coll.RECORDS)
    .find({ petId })
    .sort({ date: -1, createdAt: -1 })
    .toArray();
  return docs.map(mapMongo);
}

async function addRecord(record) {
  const db = await mongo.getDb();
  await db.collection(coll.RECORDS).insertOne({ ...record });
  return record;
}

async function updateRecord(updatedRecord) {
  const db = await mongo.getDb();
  const res = await db
    .collection(coll.RECORDS)
    .findOneAndUpdate(
      { id: updatedRecord.id },
      { $set: { ...updatedRecord } },
      { returnDocument: 'after' }
    );
  return res && res.value ? mapMongo(res.value) : null;
}

async function deleteRecord(recordId) {
  const db = await mongo.getDb();
  const res = await db.collection(coll.RECORDS).deleteOne({ id: recordId });
  return res.deletedCount > 0;
}

async function deleteRecordsByPet(petId) {
  const db = await mongo.getDb();
  const res = await db.collection(coll.RECORDS).deleteMany({ petId });
  return res.deletedCount;
}

module.exports = {
  EMAIL_TAKEN,
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
