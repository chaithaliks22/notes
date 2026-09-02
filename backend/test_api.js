import http from 'http';

const API_BASE = 'http://localhost:5000/api/notes';

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null,
          });
        } catch {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING NOTENEST AUTOMATED INTEGRATION TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`PASS: ${message}`);
      passed++;
    } else {
      console.error(`FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await request('http://localhost:5000/api/health');
    assert(health.statusCode === 200, 'GET /api/health returns 200');
    assert(health.body?.status === 'success', 'Health status is success');

    // 2. Create Note
    const newNotePayload = {
      title: 'Automated Test Note',
      content: 'This note was created by automated integration test.',
      category: 'Study',
      tags: ['automated', 'test', 'integration'],
    };
    const created = await request(API_BASE, { method: 'POST' }, newNotePayload);
    assert(created.statusCode === 201, 'POST /api/notes returns 201 Created');
    assert(created.body?.title === newNotePayload.title, 'Created note has correct title');
    assert(created.body?.category === 'Study', 'Created note has correct category');
    assert(Array.isArray(created.body?.tags) && created.body.tags.includes('automated'), 'Tags array correctly saved');
    assert(Boolean(created.body?._id), 'Note has MongoDB ObjectId (_id)');

    const noteId = created.body?._id;

    // 3. Get All Notes
    const allNotes = await request(API_BASE);
    assert(allNotes.statusCode === 200, 'GET /api/notes returns 200 OK');
    assert(Array.isArray(allNotes.body) && allNotes.body.length > 0, 'Notes list is non-empty array');

    // 4. Get Note By ID
    const singleNote = await request(`${API_BASE}/${noteId}`);
    assert(singleNote.statusCode === 200, 'GET /api/notes/:id returns 200 OK');
    assert(singleNote.body?._id === noteId, 'Fetched note matches requested ID');

    // 5. Search Notes
    const searchRes = await request(`${API_BASE}?search=Automated`);
    assert(searchRes.statusCode === 200, 'GET /api/notes?search=... returns 200 OK');
    assert(searchRes.body.some((n) => n._id === noteId), 'Search found created note by title keyword');

    // 6. Filter by Category
    const categoryRes = await request(`${API_BASE}?category=Study`);
    assert(categoryRes.statusCode === 200, 'GET /api/notes?category=Study returns 200 OK');
    assert(categoryRes.body.every((n) => n.category === 'Study'), 'All returned notes have Study category');

    // 7. Update Note (PUT)
    const updatePayload = {
      title: 'Automated Test Note [UPDATED]',
      content: 'Updated content body.',
      category: 'Work',
      tags: ['updated', 'verified'],
    };
    const updated = await request(`${API_BASE}/${noteId}`, { method: 'PUT' }, updatePayload);
    assert(updated.statusCode === 200, 'PUT /api/notes/:id returns 200 OK');
    assert(updated.body?.title === updatePayload.title, 'Updated note reflects new title');
    assert(updated.body?.category === 'Work', 'Updated note reflects new category');

    // 8. Toggle Pin Status (PATCH)
    const pinRes = await request(`${API_BASE}/${noteId}/pin`, { method: 'PATCH' });
    assert(pinRes.statusCode === 200, 'PATCH /api/notes/:id/pin returns 200 OK');
    assert(pinRes.body?.isPinned === true, 'Note is now pinned (isPinned = true)');

    const unpinRes = await request(`${API_BASE}/${noteId}/pin`, { method: 'PATCH' });
    assert(unpinRes.statusCode === 200, 'PATCH /api/notes/:id/pin toggle returns 200 OK');
    assert(unpinRes.body?.isPinned === false, 'Note is now unpinned (isPinned = false)');

    // 9. Delete Note (DELETE)
    const deleted = await request(`${API_BASE}/${noteId}`, { method: 'DELETE' });
    assert(deleted.statusCode === 200, 'DELETE /api/notes/:id returns 200 OK');
    assert(deleted.body?.message === 'Note deleted successfully', 'Delete returns success message');

    // 9. Verify Note is Deleted (404)
    const getDeleted = await request(`${API_BASE}/${noteId}`);
    assert(getDeleted.statusCode === 404, 'GET /api/notes/:id after deletion returns 404');

    // 10. Validation Tests
    const emptyTitleRes = await request(API_BASE, { method: 'POST' }, { title: '', content: 'Valid Content' });
    assert(emptyTitleRes.statusCode === 400, 'POST with empty title returns 400 Bad Request');

    const emptyContentRes = await request(API_BASE, { method: 'POST' }, { title: 'Valid Title', content: '' });
    assert(emptyContentRes.statusCode === 400, 'POST with empty content returns 400 Bad Request');

    const invalidIdRes = await request(`${API_BASE}/invalidMongoId123`);
    assert(invalidIdRes.statusCode === 404, 'GET with invalid MongoDB ID format returns 404');

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================`);
  } catch (error) {
    console.error('Integration test failed with error:', error);
  }
}

runTests();
