'use strict';

const storage = require('../storage/json-storage');
const { HttpError } = require('../utils/http-error');
const {
  isBlank,
  isDateOnly,
  normalizeInput,
} = require('../utils/validation');

/**
 * Pet business logic. Every function takes the ownerId from the
 * authenticated request and verifies ownership before reading or writing.
 */

const MAX_LENGTHS = { name: 60, species: 40, breed: 60, notes: 1000, imageUrl: 500 };
const GENDERS = ['Male', 'Female'];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* Domain composition (data-level, not presentation)                   */
/* ------------------------------------------------------------------ */

/**
 * Enriches a pet with domain-derived facts the frontend can present however
 * it likes:
 *   - healthRecordCount: total records for the pet
 *   - nextCare: soonest record dated today or in the future (or null)
 *   - lastCare: most recent record dated before today (or null)
 */
function composePet(pet) {
  const records = storage.getRecordsByPet(pet.id);
  const today = todayIso();

  const upcoming = records.filter((record) => record.date >= today);
  const past = records.filter((record) => record.date < today);

  const nextCare = upcoming.length
    ? {
        id: upcoming[upcoming.length - 1].id,
        type: upcoming[upcoming.length - 1].type,
        title: upcoming[upcoming.length - 1].title,
        date: upcoming[upcoming.length - 1].date,
      }
    : null;
  const lastCare = past.length
    ? { id: past[0].id, type: past[0].type, title: past[0].title, date: past[0].date }
    : null;

  return { ...pet, healthRecordCount: records.length, nextCare, lastCare };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function validatePetInput(data, errors) {
  if (isBlank(data.name)) errors.name = 'Please give your pet a name.';
  else if (data.name.length > MAX_LENGTHS.name) errors.name = 'Name must be 60 characters or fewer.';

  if (isBlank(data.species)) errors.species = 'Please choose a species.';
  else if (data.species.length > MAX_LENGTHS.species) errors.species = 'Species must be 40 characters or fewer.';

  if (data.breed && data.breed.length > MAX_LENGTHS.breed) errors.breed = 'Breed must be 60 characters or fewer.';

  if (data.dateOfBirth) {
    if (!isDateOnly(data.dateOfBirth)) errors.dateOfBirth = 'Date of birth must be a valid date.';
    else if (data.dateOfBirth > todayIso()) errors.dateOfBirth = 'Date of birth cannot be in the future.';
  }

  if (data.gender && !GENDERS.includes(data.gender)) {
    errors.gender = 'Gender must be Male, Female, or left empty.';
  }

  if (data.weightKg !== null && data.weightKg !== undefined && data.weightKg !== '') {
    const weight = Number(data.weightKg);
    if (!Number.isFinite(weight) || weight <= 0) errors.weightKg = 'Weight must be a positive number.';
    else if (weight > 400) errors.weightKg = 'Weight looks too large to be right.';
  }

  if (data.notes && data.notes.length > MAX_LENGTHS.notes) errors.notes = 'Notes must be 1000 characters or fewer.';

  if (data.imageUrl) {
    if (data.imageUrl.length > MAX_LENGTHS.imageUrl) errors.imageUrl = 'Image URL is too long.';
    else if (!/^(https?:\/\/|\/)/.test(data.imageUrl)) errors.imageUrl = 'Image must be a URL or a path starting with “/”.';
  }
}

/* ------------------------------------------------------------------ */
/* Persistence + ownership                                             */
/* ------------------------------------------------------------------ */

function buildPet(ownerId, data) {
  return {
    id: storage.newId(),
    ownerId,
    name: data.name,
    species: data.species,
    breed: data.breed || '',
    dateOfBirth: data.dateOfBirth || null,
    gender: data.gender || null,
    weightKg:
      data.weightKg === undefined || data.weightKg === null || data.weightKg === ''
        ? null
        : Number(data.weightKg),
    notes: data.notes || '',
    imageUrl: data.imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function getOwnedPet(ownerId, petId) {
  const pet = storage.findPetById(petId);
  // Unknown id and another user's pet are indistinguishable to the caller —
  // a user must not be able to probe for the existence of foreign pets.
  if (!pet || pet.ownerId !== ownerId) {
    throw new HttpError(404, 'Pet not found.');
  }
  return pet;
}

function applyUpdates(pet, data) {
  return {
    ...pet,
    name: data.name,
    species: data.species,
    breed: data.breed || '',
    dateOfBirth: data.dateOfBirth || null,
    gender: data.gender || null,
    weightKg:
      data.weightKg === undefined || data.weightKg === null || data.weightKg === ''
        ? null
        : Number(data.weightKg),
    notes: data.notes || '',
    imageUrl: data.imageUrl || '',
    updatedAt: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Public service API                                                  */
/* ------------------------------------------------------------------ */

function listForOwner(ownerId) {
  return storage.getPetsByOwner(ownerId).map(composePet);
}

function getForOwner(ownerId, petId) {
  return composePet(getOwnedPet(ownerId, petId));
}

function createForOwner(ownerId, input) {
  const data = normalizeInput(input);
  const errors = {};
  validatePetInput(data, errors);
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  }
  return composePet(storage.addPet(buildPet(ownerId, data)));
}

function updateForOwner(ownerId, petId, input) {
  const pet = getOwnedPet(ownerId, petId);
  const data = normalizeInput(input);
  const errors = {};
  validatePetInput(data, errors);
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  }
  return composePet(storage.updatePet(applyUpdates(pet, data)));
}

function removeForOwner(ownerId, petId) {
  getOwnedPet(ownerId, petId);
  storage.deletePet(petId);
  storage.deleteRecordsByPet(petId);
}

module.exports = {
  listForOwner,
  getForOwner,
  createForOwner,
  updateForOwner,
  removeForOwner,
  composePet,
};

