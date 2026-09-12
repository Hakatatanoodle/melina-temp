'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * JSON storage layer.
 *
 * This is the ONLY module in the backend that touches the file system.
 * Everything else goes through services -> storage. Each entity is persisted
 * as a JSON array in `backend/data/`; files are created on first use so the
 * application boots on a fresh machine.
 *
 * All mutations are synchronous file reads/writes. For a single-process
 * classroom application this is simple, auditable, and durable across
 * restarts; a database could later replace this module without touching
 * controllers or services.
 */

const DATA_DIR = path.join(__dirname, '..', 'data');

const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  pets: path.join(DATA_DIR, 'pets.json'),
  'health-records': path.join(DATA_DIR, 'health-records.json'),
};

function ensureDataFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const file of Object.values(FILES)) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]\n', 'utf8');
    }
  }
}

function readCollection(entity) {
  ensureDataFiles();
  const raw = fs.readFileSync(FILES[entity], 'utf8').trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

function writeCollection(entity, records) {
  ensureDataFiles();
  fs.writeFileSync(FILES[entity], `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

function newId() {
  return crypto.randomUUID();
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

function readUsers() {
  return readCollection('users');
}

function writeUsers(users) {
  writeCollection('users', users);
}

function findUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  return readUsers().find((user) => user.email.toLowerCase() === normalized) || null;
}

function findUserById(id) {
  return readUsers().find((user) => user.id === id) || null;
}

function addUser({ fullName, email, passwordHash }) {
  const users = readUsers();
  const user = {
    id: newId(),
    fullName,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

/* ------------------------------------------------------------------ */
/* Pets                                                                */
/* ------------------------------------------------------------------ */

function readPets() {
  return readCollection('pets');
}

function writePets(pets) {
  writeCollection('pets', pets);
}

function findPetById(petId) {
  return readPets().find((pet) => pet.id === petId) || null;
}

function getPetsByOwner(ownerId) {
  return readPets()
    .filter((pet) => pet.ownerId === ownerId)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

function addPet(pet) {
  const pets = readPets();
  pets.push(pet);
  writePets(pets);
  return pet;
}

function updatePet(updatedPet) {
  const pets = readPets();
  const index = pets.findIndex((pet) => pet.id === updatedPet.id);
  if (index === -1) return null;
  pets[index] = updatedPet;
  writePets(pets);
  return updatedPet;
}

function deletePet(petId) {
  const pets = readPets();
  const next = pets.filter((pet) => pet.id !== petId);
  const existed = next.length !== pets.length;
  if (existed) writePets(next);
  return existed;
}

/* ------------------------------------------------------------------ */
/* Health records                                                      */
/* ------------------------------------------------------------------ */

function readRecords() {
  return readCollection('health-records');
}

function writeRecords(records) {
  writeCollection('health-records', records);
}

function findRecordById(recordId) {
  return readRecords().find((record) => record.id === recordId) || null;
}

function getRecordsByPet(petId) {
  return readRecords()
    .filter((record) => record.petId === petId)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.createdAt).localeCompare(String(a.createdAt)));
}

function addRecord(record) {
  const records = readRecords();
  records.push(record);
  writeRecords(records);
  return record;
}

function updateRecord(updatedRecord) {
  const records = readRecords();
  const index = records.findIndex((record) => record.id === updatedRecord.id);
  if (index === -1) return null;
  records[index] = updatedRecord;
  writeRecords(records);
  return updatedRecord;
}

function deleteRecord(recordId) {
  const records = readRecords();
  const next = records.filter((record) => record.id !== recordId);
  const existed = next.length !== records.length;
  if (existed) writeRecords(next);
  return existed;
}

/** Cascade used when a pet is deleted. */
function deleteRecordsByPet(petId) {
  const records = readRecords();
  const next = records.filter((record) => record.petId !== petId);
  writeRecords(next);
  return records.length - next.length;
}

module.exports = {
  ensureDataFiles,
  newId,
  // users
  readUsers,
  writeUsers,
  findUserByEmail,
  findUserById,
  addUser,
  // pets
  findPetById,
  getPetsByOwner,
  addPet,
  updatePet,
  deletePet,
  // health records
  getRecordsByPet,
  findRecordById,
  addRecord,
  updateRecord,
  deleteRecord,
  deleteRecordsByPet,
};
