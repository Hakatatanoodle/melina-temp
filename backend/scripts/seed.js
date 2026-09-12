'use strict';

/**
 * Demo seed for PetCare.
 *
 *   npm run seed   (+ MONGODB_URI=... to seed the cloud database instead)
 *
 * WARNING: this resets the target store to a fresh demo state.
 * Creates the account  demo@petcare.dev  (password: demo-petcare)
 * with Bruno and Luna plus realistic health records.
 */

const bcrypt = require('bcryptjs');

const storage = require('../storage');
const uploadStorage = require('../storage/uploads');

function isoOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function resetStore() {
  await storage.ensureDataFiles();
  if (storage.useMongo()) {
    const { getDb } = require('../storage/mongo');
    const db = await getDb();
    await Promise.all([
      db.collection('users').deleteMany({}),
      db.collection('pets').deleteMany({}),
      db.collection('health_records').deleteMany({}),
    ]);
  } else {
    const fs = require('fs');
    const path = require('path');
    const DATA_DIR = path.join(__dirname, '..', 'data');
    for (const name of ['users.json', 'pets.json', 'health-records.json']) {
      fs.writeFileSync(path.join(DATA_DIR, name), '[]\n', 'utf8');
    }
  }
  uploadStorage.clearAll();
}

async function main() {
  await resetStore();

  const user = await storage.addUser({
    fullName: 'Alex Rivera',
    email: 'demo@petcare.dev',
    passwordHash: bcrypt.hashSync('demo-petcare', 10),
  });

  const bruno = await storage.addPet({
    id: storage.newId(),
    ownerId: user.id,
    name: 'Bruno',
    species: 'Dog',
    breed: 'Golden Retriever',
    dateOfBirth: isoOffset(-365 * 3 - 60),
    gender: 'Male',
    weightKg: 28.5,
    notes: 'Loves long walks and swimming. Food-motivated, gentle with kids.',
    imageUrl: '/images/pets/sample/dog-1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const luna = await storage.addPet({
    id: storage.newId(),
    ownerId: user.id,
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    dateOfBirth: isoOffset(-365 * 2 - 100),
    gender: 'Female',
    weightKg: 4.2,
    notes: 'Indoor cat. Brush twice a week — she sheds a lot in spring.',
    imageUrl: '/images/pets/sample/cat-1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const coco = await storage.addPet({
    id: storage.newId(),
    ownerId: user.id,
    name: 'Coco',
    species: 'Cat',
    breed: 'Tabby',
    dateOfBirth: isoOffset(-365 - 40),
    gender: 'Male',
    weightKg: 4.8,
    notes: 'Street rescue, spoiled rotten. Loves cardboard boxes.',
    imageUrl: '/images/pets/sample/cat-3.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const nibbles = await storage.addPet({
    id: storage.newId(),
    ownerId: user.id,
    name: 'Nibbles',
    species: 'Hamster',
    breed: '',
    dateOfBirth: null,
    gender: 'Male',
    weightKg: 0.12,
    notes: 'Wheel comes out at midnight. Handle gently.',
    imageUrl: '/images/pets/sample/hamster-1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const records = [
    {
      petId: bruno.id,
      type: 'vaccination',
      title: 'Rabies booster',
      date: isoOffset(30),
      clinic: 'Green Valley Clinic',
      description: 'Annual rabies booster due. Schedule morning appointment.',
    },
    {
      petId: bruno.id,
      type: 'checkup',
      title: 'General checkup',
      date: isoOffset(-23),
      clinic: 'Healthy Paws Veterinary',
      description: 'All clear. Vet recommends continuing joint supplements.',
    },
    {
      petId: bruno.id,
      type: 'medication',
      title: 'Ear infection treatment',
      date: isoOffset(-120),
      clinic: 'Healthy Paws Veterinary',
      description: '10-day drops, completed. No recurrence since.',
    },
    {
      petId: luna.id,
      type: 'checkup',
      title: 'Annual wellness exam',
      date: isoOffset(-9),
      clinic: 'Green Valley Clinic',
      description: 'Healthy weight. Slight tartar build-up — monitor teeth.',
    },
    {
      petId: luna.id,
      type: 'vaccination',
      title: 'FVRCP vaccine',
      date: isoOffset(-210),
      clinic: 'Green Valley Clinic',
      description: 'Core vaccine, no reaction.',
    },
    {
      petId: luna.id,
      type: 'other',
      title: 'Grooming note',
      date: isoOffset(-320),
      clinic: '',
      description: 'Started brushing routine; mats reduced significantly.',
    },
    {
      petId: coco.id,
      type: 'vaccination',
      title: 'FVRCP vaccine',
      date: isoOffset(-14),
      clinic: 'Green Valley Clinic',
      description: 'Initial vaccine series, first dose. No reaction.',
    },
    {
      petId: nibbles.id,
      type: 'checkup',
      title: 'First vet visit',
      date: isoOffset(-35),
      clinic: 'Small Friends Veterinary',
      description: 'Healthy. Advised to trim nails monthly.',
    },
  ];

  for (const record of records) {
    await storage.addRecord({
      id: storage.newId(),
      ...record,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  const petCount = (await storage.getPetsByOwner(user.id)).length;
  console.log(`Seed complete (store: ${storage.useMongo() ? 'MongoDB Atlas' : 'local JSON'}).`);
  console.log('  login:  demo@petcare.dev');
  console.log('  password: demo-petcare');
  console.log(`  pets: ${petCount}, records: ${records.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
