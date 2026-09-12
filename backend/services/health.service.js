'use strict';

const storage = require('../storage');
const { HttpError } = require('../utils/http-error');
const { isBlank, isDateOnly, normalizeInput } = require('../utils/validation');

/**
 * Health-record business logic. Ownership is always verified through the
 * record's parent pet, so a user can never touch another user's records even
 * by guessing record ids.
 */

const RECORD_TYPES = ['vaccination', 'checkup', 'medication', 'treatment', 'other'];
const MAX_LENGTHS = { title: 80, clinic: 80, description: 1000 };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function getOwnedPet(ownerId, petId) {
  const pet = await storage.findPetById(petId);
  if (!pet || pet.ownerId !== ownerId) {
    throw new HttpError(404, 'Pet not found.');
  }
  return pet;
}

async function getOwnedRecord(ownerId, recordId) {
  const record = await storage.findRecordById(recordId);
  if (!record) {
    throw new HttpError(404, 'Health record not found.');
  }
  const pet = await storage.findPetById(record.petId);
  if (!pet || pet.ownerId !== ownerId) {
    throw new HttpError(404, 'Health record not found.');
  }
  return record;
}

function validateRecordInput(data, errors) {
  if (!RECORD_TYPES.includes(data.type)) errors.type = 'Please choose a record type.';
  if (isBlank(data.title)) errors.title = 'Please give the record a title.';
  else if (data.title.length > MAX_LENGTHS.title) errors.title = 'Title must be 80 characters or fewer.';

  if (isBlank(data.date)) errors.date = 'Please choose a date.';
  else if (!isDateOnly(data.date)) errors.date = 'Date must be a valid date.';

  if (data.clinic && data.clinic.length > MAX_LENGTHS.clinic) errors.clinic = 'Clinic must be 80 characters or fewer.';
  if (data.description && data.description.length > MAX_LENGTHS.description) {
    errors.description = 'Description must be 1000 characters or fewer.';
  }
}

function buildRecord(petId, data) {
  return {
    id: storage.newId(),
    petId,
    type: data.type,
    title: data.title,
    date: data.date,
    clinic: data.clinic || '',
    description: data.description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function listForPet(ownerId, petId) {
  await getOwnedPet(ownerId, petId);
  return storage.getRecordsByPet(petId);
}

async function createForPet(ownerId, petId, input) {
  await getOwnedPet(ownerId, petId);
  const data = normalizeInput(input);
  const errors = {};
  validateRecordInput(data, errors);
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  }
  return storage.addRecord(buildRecord(petId, data));
}

async function updateForOwner(ownerId, recordId, input) {
  const record = await getOwnedRecord(ownerId, recordId);
  const data = normalizeInput(input);
  const errors = {};
  validateRecordInput(data, errors);
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  }
  const updated = {
    ...record,
    type: data.type,
    title: data.title,
    date: data.date,
    clinic: data.clinic || '',
    description: data.description || '',
    updatedAt: new Date().toISOString(),
  };
  return storage.updateRecord(updated);
}

async function removeForOwner(ownerId, recordId) {
  await getOwnedRecord(ownerId, recordId);
  await storage.deleteRecord(recordId);
}

async function listForOwner(ownerId) {
  const pets = await storage.getPetsByOwner(ownerId);

  const records = [];
  for (const pet of pets) {
    for (const record of await storage.getRecordsByPet(pet.id)) {
      records.push({
        ...record,
        pet: { id: pet.id, name: pet.name, imageUrl: pet.imageUrl },
      });
    }
  }

  records.sort(
    (a, b) =>
      String(b.date).localeCompare(String(a.date)) ||
      String(b.createdAt).localeCompare(String(a.createdAt))
  );
  return records;
}

module.exports = {
  RECORD_TYPES,
  listForPet,
  listForOwner,
  createForPet,
  updateForOwner,
  removeForOwner,
};
