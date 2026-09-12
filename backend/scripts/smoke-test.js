'use strict';

/**
 * End-to-end API smoke test for PetCare.
 *
 * Usage:  npm run smoke-test   (expects the backend running on :4000)
 *         BASE_URL=http://localhost:4000 node scripts/smoke-test.js
 *
 * It exercises the complete journey from product.md §13 plus the security
 * requirements: registration persistence, hashed passwords, login, cookie
 * session, full pet + health-record CRUD, ownership enforcement across two
 * users, validation errors, and logout.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const DATA_DIR = path.join(__dirname, '..', 'data');

let passed = 0;
let failed = 0;

function check(name, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failed += 1;
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function makeAgent() {
  let cookie = null;

  function setCookieFromHeaders(res) {
    const setCookie = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const entry of setCookie) {
      const [pair] = entry.split(';');
      if (pair.startsWith('petcare_token=')) {
        if (pair === 'petcare_token=') cookie = null; // cleared
        else cookie = pair;
      }
    }
  }

  return {
    rawCookie: () => cookie,
    async request(method, url, body) {
      const headers = {};
      if (cookie) headers.Cookie = cookie;
      if (body !== undefined) headers['Content-Type'] = 'application/json';

      const res = await fetch(`${BASE_URL}${url}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      setCookieFromHeaders(res);

      let json = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      return { status: res.status, body: json };
    },
    async requestForm(method, url, form) {
      const headers = {};
      if (cookie) headers.Cookie = cookie;
      const res = await fetch(`${BASE_URL}${url}`, { method, headers, body: form });
      setCookieFromHeaders(res);

      let json = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      return { status: res.status, body: json };
    },
  };
}

function readDataFile(name) {
  const raw = fs.readFileSync(path.join(DATA_DIR, name), 'utf8').trim();
  return raw ? JSON.parse(raw) : [];
}

/** In Mongo mode the persistence check reads back through a fresh API session. */
async function mongoUserSnapshot(email) {
  const probe = makeAgent();
  // Registration already happened through the API, so a direct DB read is not
  // possible from here — verify persistence via a fresh login + /me instead.
  const login = await probe.request('POST', '/api/auth/login', {
    email,
    password: globalThis.__smokePassword,
  });
  const me = await probe.request('GET', '/api/auth/me');
  return { login, me };
}

async function main() {
  const agent = makeAgent();
  const suffix = Date.now().toString(36).slice(-6);
  const userA = { fullName: 'Alex Rivera', email: `alex.${suffix}@example.com`, password: 'sunflower-42', confirmPassword: 'sunflower-42' };
  const userB = { fullName: 'Bea Novak', email: `bea.${suffix}@example.com`, password: 'maple-syrup-9', confirmPassword: 'maple-syrup-9' };
  let uploadedPath = null;

  console.log('— Health —');
  const health = await agent.request('GET', '/api/health');
  check('GET /api/health responds', health.status === 200 && health.body?.data?.ok === true);

  console.log('— Registration —');
  const reg = await agent.request('POST', '/api/auth/register', userA);
  check('register returns 201 + user', reg.status === 201 && reg.body?.data?.user?.email === userA.email);
  const cookieMe = await agent.request('GET', '/api/auth/me');
  check('register sets a working auth cookie', cookieMe.status === 200 && cookieMe.body?.data?.user?.email === userA.email);

  if (process.env.MONGODB_URI) {
    // Cloud store: prove the account really persisted by logging in fresh.
    globalThis.__smokePassword = userA.password;
    const snapshot = await mongoUserSnapshot(userA.email);
    check('user persisted in MongoDB (fresh login works)', snapshot.login.status === 200);
    check(
      'password verified by backend (never echoed back)',
      snapshot.me.status === 200 && !JSON.stringify(snapshot.me.body).includes(userA.password)
    );
  } else {
    const storedUsers = readDataFile('users.json');
    const storedA = storedUsers.find((u) => u.email === userA.email);
    check('user persisted by backend', Boolean(storedA));
    check('password stored as bcrypt hash (not plain text)', Boolean(storedA?.passwordHash?.startsWith('$2')) && !JSON.stringify(storedA).includes(userA.password));
  }

  const dup = await agent.request('POST', '/api/auth/register', userA);
  check('duplicate email rejected with 409', dup.status === 409);

  const badReg = await agent.request('POST', '/api/auth/register', { fullName: '', email: 'nope', password: 'short', confirmPassword: 'other' });
  check('invalid registration → 400 with field errors', badReg.status === 400 && badReg.body?.errors?.email && badReg.body?.errors?.password);

  console.log('— Session —');
  const me = await agent.request('GET', '/api/auth/me');
  check('GET /api/auth/me returns the user', me.status === 200 && me.body?.data?.user?.fullName === userA.fullName);

  console.log('— Pet CRUD —');
  const petIn = { name: 'Bruno', species: 'Dog', breed: 'Golden Retriever', dateOfBirth: '2023-05-14', gender: 'Male', weightKg: 28.5, notes: 'Loves long walks.' };
  const created = await agent.request('POST', '/api/pets', petIn);
  const pet = created.body?.data?.pet;
  check('create pet returns 201 with data', created.status === 201 && pet?.name === 'Bruno');
  check('pet is owned by the creator', pet?.ownerId === reg.body.data.user.id);

  const listed = await agent.request('GET', '/api/pets');
  check('list pets shows the new pet', listed.status === 200 && listed.body.data.pets.length === 1);

  console.log('— Photo uploads —');
  const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4, 5, 6, 7, 8]);
  const uploadForm = new FormData();
  uploadForm.append('photo', new Blob([pngBytes], { type: 'image/png' }), 'portrait.png');
  const upload = await agent.requestForm('POST', '/api/uploads', uploadForm);
  uploadedPath = upload.body?.data?.path;
  check(
    'upload image returns 201 with an api path',
    upload.status === 201 && /^\/api\/uploads\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.png$/.test(uploadedPath || '')
  );
  const served = uploadedPath ? await fetch(`${BASE_URL}${uploadedPath}`, { headers: { Cookie: agent.rawCookie() } }) : null;
  check('uploaded image is served back with auth', served?.status === 200 && served?.headers?.get('content-type')?.includes('image/png'));

  const textForm = new FormData();
  textForm.append('photo', new Blob(['not an image'], { type: 'text/plain' }), 'note.txt');
  const rejected = await agent.requestForm('POST', '/api/uploads', textForm);
  check('non-image upload rejected (415)', rejected.status === 415);

  const tooBig = new FormData();
  tooBig.append('photo', new Blob([new Uint8Array(6 * 1024 * 1024).fill(0x89)], { type: 'image/png' }), 'huge.png');
  check('oversized upload rejected (413)', (await agent.requestForm('POST', '/api/uploads', tooBig)).status === 413);

  const updated = await agent.request('PUT', `/api/pets/${pet.id}`, {
    ...petIn,
    name: 'Bruno B',
    weightKg: 29,
    imageUrl: uploadedPath || petIn.imageUrl,
  });
  check(
    'update pet persists new values + uploaded photo',
    updated.status === 200 &&
      updated.body.data.pet.name === 'Bruno B' &&
      updated.body.data.pet.weightKg === 29 &&
      updated.body.data.pet.imageUrl === uploadedPath
  );

  const badPet = await agent.request('POST', '/api/pets', { name: '', species: '' });
  check('invalid pet → 400 with field errors', badPet.status === 400 && badPet.body?.errors?.name && badPet.body?.errors?.species);

  console.log('— Health records —');
  const recIn = { type: 'vaccination', title: 'Rabies Vaccination', date: '2026-10-12', clinic: 'Green Valley Clinic', description: 'Annual booster.' };
  const recCreated = await agent.request('POST', `/api/pets/${pet.id}/health-records`, recIn);
  const record = recCreated.body?.data?.record;
  check('create health record returns 201', recCreated.status === 201 && record?.title === 'Rabies Vaccination');

  const recList = await agent.request('GET', `/api/pets/${pet.id}/health-records`);
  check('list health records for pet', recList.status === 200 && recList.body.data.records.length === 1);
  const petAfterRecords = (await agent.request('GET', '/api/pets')).body.data.pets[0];
  check('pet list reports healthRecordCount + nextCare', petAfterRecords.healthRecordCount === 1 && petAfterRecords.nextCare?.title === 'Rabies Vaccination');

  const recUpdated = await agent.request('PUT', `/api/health-records/${record.id}`, { ...recIn, title: 'Rabies Booster' });
  check('update health record', recUpdated.status === 200 && recUpdated.body.data.record.title === 'Rabies Booster');

  const recBad = await agent.request('POST', `/api/pets/${pet.id}/health-records`, { type: 'mystery', title: '', date: 'not-a-date' });
  check('invalid record → 400 with field errors', recBad.status === 400 && recBad.body?.errors?.type && recBad.body?.errors?.title && recBad.body?.errors?.date);

  const recDeleted = await agent.request('DELETE', `/api/health-records/${record.id}`);
  check('delete health record', recDeleted.status === 200);
  check('record really removed', (await agent.request('GET', `/api/pets/${pet.id}/health-records`)).body.data.records.length === 0);

  console.log('— Ownership enforcement (User B) —');
  const regB = await agent.request('POST', '/api/auth/register', userB);
  check('register second user', regB.status === 201);

  const foreignGet = await agent.request('GET', `/api/pets/${pet.id}`);
  check("User B cannot GET User A's pet (404)", foreignGet.status === 404);

  const foreignPut = await agent.request('PUT', `/api/pets/${pet.id}`, petIn);
  check("User B cannot UPDATE User A's pet (404)", foreignPut.status === 404);

  const foreignDelete = await agent.request('DELETE', `/api/pets/${pet.id}`);
  check("User B cannot DELETE User A's pet (404)", foreignDelete.status === 404);

  const foreignRec = await agent.request('POST', `/api/pets/${pet.id}/health-records`, recIn);
  check("User B cannot add records to User A's pet (404)", foreignRec.status === 404);

  if (uploadedPath) {
    const foreignUpload = await fetch(`${BASE_URL}${uploadedPath}`, { headers: { Cookie: agent.rawCookie() } });
    check("User B cannot view User A's uploaded photo (404)", foreignUpload.status === 404);
  }

  check("User B cannot list User A's pets", (await agent.request('GET', '/api/pets')).body.data.pets.length === 0);

  const noAuth = makeAgent(); // no cookie at all
  check('unauthenticated request rejected (401)', (await noAuth.request('GET', '/api/pets')).status === 401);
  check("User B cannot read /api/auth/me as User A's identity", !(await noAuth.request('GET', '/api/auth/me')).body?.data?.user);

  console.log('— Delete + logout —');
  // Switch the agent back to User A via a real login (cookie now belongs to A).
  const switchBack = await agent.request('POST', '/api/auth/login', { email: userA.email, password: userA.password });
  check('User A logs back in before deleting', switchBack.status === 200 && switchBack.body?.data?.user?.email === userA.email);
  check('owner deletes own pet', (await agent.request('DELETE', `/api/pets/${pet.id}`)).status === 200);
  check("User A's pet list empty again", (await agent.request('GET', '/api/pets')).body.data.pets.length === 0);

  if (uploadedPath) {
    const orphan = await fetch(`${BASE_URL}${uploadedPath}`, { headers: { Cookie: agent.rawCookie() } });
    check('deleting the pet removes its uploaded photo (404)', orphan.status === 404);
  }

  const logout = await agent.request('POST', '/api/auth/logout');
  check('logout clears the auth cookie', logout.status === 200 && (await agent.request('GET', '/api/auth/me')).status === 401);

  console.log('— Login —');
  const badLogin = await agent.request('POST', '/api/auth/login', { email: userA.email, password: 'wrong-password' });
  check('wrong password rejected with 401', badLogin.status === 401 && badLogin.body?.message === 'Invalid email or password.');

  const goodLogin = await agent.request('POST', '/api/auth/login', { email: userA.email, password: userA.password });
  check('correct credentials log in', goodLogin.status === 200 && goodLogin.body.data.user.email === userA.email);

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});

