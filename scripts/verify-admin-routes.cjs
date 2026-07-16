require('./load-env.cjs');

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const localEnv = path.join(process.cwd(), '.env.local');
if (fs.existsSync(localEnv)) {
  for (const line of fs.readFileSync(localEnv, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

const baseUrl = process.env.ADMIN_VERIFY_URL || 'http://127.0.0.1:3000';

function sessionCookie() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters');
  const expires = String(Date.now() + 60 * 60 * 1000);
  const signature = crypto.createHmac('sha256', secret).update(expires).digest('hex');
  return `admin_session=${expires}.${signature}`;
}

async function check(path, expectedStatus, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual', ...options });
  const expected = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
  if (!expected.includes(response.status)) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`${path}: expected ${expected.join(' or ')}, received ${response.status}${detail ? ` — ${detail}` : ''}`);
  }
  return {
    path,
    status: response.status,
    location: response.headers.get('location'),
  };
}

(async () => {
  const cookie = sessionCookie();
  const authHeaders = { Cookie: cookie };
  const results = [];

  const unauthenticated = await check('/admin', 307);
  if (!unauthenticated.location?.endsWith('/admin/login')) {
    throw new Error('/admin did not redirect unauthenticated users to /admin/login');
  }
  results.push(unauthenticated);
  results.push(await check('/admin/login', 200));
  results.push(await check('/api/admin/login', 401, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'invalid@example.com', password: 'invalid-password' }),
  }));

  const adminEntry = await check('/admin', [200, 307], { headers: authHeaders });
  if (adminEntry.status === 307 && !adminEntry.location?.endsWith('/admin/dashboard')) {
    throw new Error('/admin did not redirect authenticated users to /admin/dashboard');
  }
  results.push(adminEntry);

  for (const path of ['/admin/dashboard', '/admin/properties', '/admin/properties/new', '/admin/leads', '/admin/settings']) {
    results.push(await check(path, 200, { headers: authHeaders }));
  }
  const propertyResponse = await fetch(`${baseUrl}/api/properties?limit=1`);
  if (!propertyResponse.ok) throw new Error(`/api/properties: received ${propertyResponse.status}`);
  const propertyData = await propertyResponse.json();
  const propertyId = propertyData.properties?.[0]?.id;
  if (propertyId) results.push(await check(`/admin/properties/${propertyId}/edit`, 200, { headers: authHeaders }));
  results.push(await check('/api/leads?page=1&limit=1', 200, { headers: authHeaders }));
  results.push(await check('/api/settings', 200));
  results.push(await check('/api/admin/login', 200, { method: 'DELETE', headers: authHeaders }));

  console.log(JSON.stringify({ ok: true, checks: results }, null, 2));
})().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
