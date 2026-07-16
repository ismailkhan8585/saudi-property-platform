import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9444;
const origin = 'http://127.0.0.1:3100';
const outputDir = path.resolve('reports/screenshots');
await mkdir(outputDir, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new', `--remote-debugging-port=${port}`, '--remote-allow-origins=*',
  '--disable-gpu', '--disable-extensions', '--no-first-run', '--hide-scrollbars',
  `--user-data-dir=C:\\tmp\\codex-responsive-cdp-${Date.now()}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'inherit'] });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let version;
for (let attempt = 0; attempt < 30; attempt += 1) {
  try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`, { signal: AbortSignal.timeout(1000) })).json(); break; } catch { await sleep(250); }
}
if (!version) throw new Error('Chrome debugging endpoint did not start');
console.log('chrome-ready');

const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = pages.find((candidate) => candidate.type === 'page');
if (!page) throw new Error('Chrome did not expose a page target');
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
console.log('socket-open');
let nextId = 0;
const pending = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data.toString());
  if (!message.id) return;
  const handler = pending.get(message.id);
  if (!handler) return;
  pending.delete(message.id);
  if (message.error) handler.reject(new Error(message.error.message)); else handler.resolve(message.result);
});

function cdp(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await cdp('Page.enable');
await cdp('Network.enable');
await cdp('Runtime.enable');
console.log('cdp-ready');

async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
}

async function navigate(url, locale, width, height) {
  await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true, screenWidth: width, screenHeight: height });
  await cdp('Network.setCookie', { name: 'locale', value: locale, url: origin, path: '/' });
  await cdp('Page.navigate', { url: `${origin}${url}` });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await evaluate('document.readyState === "complete"')) break;
    await sleep(150);
  }
  await sleep(2500);
}

async function screenshot(name) {
  await evaluate(`document.querySelectorAll('nextjs-portal').forEach((node) => { node.style.display = 'none'; })`);
  const { data } = await cdp('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await writeFile(path.join(outputDir, name), Buffer.from(data, 'base64'));
}

async function pageMetrics() {
  return evaluate(`(() => ({
    innerWidth: window.innerWidth,
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    direction: document.documentElement.dir,
    language: document.documentElement.lang
  }))()`);
}

async function drawerAudit(locale, viewportWidth) {
  const exists = await evaluate('Boolean(document.querySelector("#mobile-menu-toggle"))');
  if (!exists) return { exists: false };
  await evaluate('document.querySelector("#mobile-menu-toggle").click()');
  await sleep(500);
  const open = await evaluate(`(() => {
    const drawer = document.querySelector('#mobile-navigation-drawer');
    const toggle = document.querySelector('#mobile-menu-toggle');
    if (!drawer) return null;
    const rect = drawer.getBoundingClientRect();
    return { x: rect.x, right: rect.right, width: rect.width, expanded: toggle.getAttribute('aria-expanded'), bodyOverflow: getComputedStyle(document.body).overflow, bodyLocked: document.body.hasAttribute('data-scroll-locked') };
  })()`);
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
  await sleep(400);
  const closed = await evaluate('document.querySelector("#mobile-menu-toggle").getAttribute("aria-expanded")');
  const correctSide = locale === 'ar' ? Math.abs(open.right - viewportWidth) < 2 : Math.abs(open.x) < 2;
  return { exists: true, open, closedExpanded: closed, correctSide };
}

const report = [];
const cases = [
  { name: 'home-ar-320x568.png', url: '/', locale: 'ar', width: 320, height: 568, drawer: false },
  { name: 'home-en-360x800.png', url: '/', locale: 'en', width: 360, height: 800, drawer: false },
  { name: 'search-ar-375x812.png', url: '/search', locale: 'ar', width: 375, height: 812, drawer: false },
  { name: 'home-ar-390x844.png', url: '/', locale: 'ar', width: 390, height: 844, drawer: true },
  { name: 'home-en-390x844.png', url: '/', locale: 'en', width: 390, height: 844, drawer: true },
  { name: 'search-ar-390x844.png', url: '/search', locale: 'ar', width: 390, height: 844, drawer: false },
  { name: 'search-en-414x896.png', url: '/search', locale: 'en', width: 414, height: 896, drawer: false },
  { name: 'home-en-480x900.png', url: '/', locale: 'en', width: 480, height: 900, drawer: false },
  { name: 'home-ar-768x1024.png', url: '/', locale: 'ar', width: 768, height: 1024, drawer: false },
  { name: 'home-en-1024x1366.png', url: '/', locale: 'en', width: 1024, height: 1366, drawer: false },
  { name: 'admin-login-390x844.png', url: '/admin/login', locale: 'en', width: 390, height: 844, drawer: false },
];

for (const testCase of cases) {
  console.log('case-start', testCase.name);
  await navigate(testCase.url, testCase.locale, testCase.width, testCase.height);
  const metrics = await pageMetrics();
  await screenshot(testCase.name);
  const drawer = testCase.drawer ? await drawerAudit(testCase.locale, testCase.width) : undefined;
  if (drawer) {
    await evaluate('document.querySelector("#mobile-menu-toggle").click()');
    await sleep(350);
    await screenshot(testCase.name.replace('.png', '-menu.png'));
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
  }
  report.push({ ...testCase, metrics, drawer });
  console.log('case-done', testCase.name);
}

await writeFile(path.resolve('reports/responsive-audit-2026-07-16.json'), JSON.stringify(report, null, 2));
socket.close();
chrome.kill();
