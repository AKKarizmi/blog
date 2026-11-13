// Local browser regression tests. API records below are fixtures, never product content.
const { chromium } = require(process.env.FOROZ_PLAYWRIGHT || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.FOROZ_CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage(); const errors = []; const checks = [];
  page.on('pageerror', e => errors.push(e.message));
  const courses = [{ id: 1, name: 'Fixture course', description: 'Test fixture', subject: 'Test', delivery: 'online', modules: ['Fixture module'], teacher: null }];
  let failCourses = false;
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== 'http://127.0.0.1:4173') return route.fulfill({ status: 200, body: '' });
    const path = url.pathname;
    if (path === '/v1/courses/' && failCourses) return route.fulfill({ status: 503, json: { error: 'Fixture failure' } });
    if (path === '/v1/courses/') return route.fulfill({ json: { courses } });
    if (path === '/v1/courses/1/') return route.fulfill({ json: courses[0] });
    if (path === '/v1/courses/categories/') return route.fulfill({ json: { categories: [{ id: 1, title: 'Fixture category', description: 'Fixture description', icon_text: null }] } });
    if (path === '/d1/get_events/') return route.fulfill({ json: { events: [
      { id: 1, title: 'Fixture registered event', description: 'Details', date: '2026-11-13', registration_link: 'https://example.org/register' },
      { id: 2, title: 'Fixture event without registration', description: 'Details', date: '2026-11-13' }
    ] } });
    if (path.startsWith('/d1/') || path === '/get_dashboard_data/') return route.fulfill({ json: {} });
    return route.continue();
  });
  await page.goto('http://127.0.0.1:4173/');
  await page.getByRole('link', { name: 'View All Programs' }).click();
  await page.getByRole('heading', { name: 'Programs & Opportunities', exact: true }).waitFor();
  await page.reload();
  await page.goto('http://127.0.0.1:4173/programs#category-1');
  await page.locator('#category-1').waitFor();
  assert.equal(await page.locator('#category-1').evaluate(node => node.getBoundingClientRect().top < 400), true);
  await page.getByRole('link', { name: 'View course', exact: true }).click();
  await page.getByRole('heading', { name: 'Fixture course' }).waitFor();
  await page.reload();
  await page.getByText('Fixture module', { exact: true }).waitFor(); checks.push('programs and course routes, refresh');
  await page.goto('http://127.0.0.1:4173/events');
  await page.reload();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'View Details' }).first().click();
    const dialog = page.getByRole('dialog'); await dialog.waitFor();
    assert.equal(await page.evaluate(() => document.querySelector('[role=dialog]').parentElement === document.body), true);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    assert.equal(await dialog.getByRole('link', { name: 'Register Now' }).getAttribute('href'), 'https://example.org/register');
    assert.equal(await dialog.getByRole('link', { name: 'Register Now' }).getAttribute('rel'), 'noopener noreferrer');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('[role=dialog]')), true);
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' });
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  }
  checks.push('repeated modal open, portal, focus, Escape, scroll cleanup, external registration');
  await page.getByRole('button', { name: 'View Details' }).nth(1).click();
  assert.equal(await page.getByRole('button', { name: 'Registration unavailable' }).isDisabled(), true);
  await page.getByRole('button', { name: 'Close dialog' }).click(); checks.push('missing registration disabled, close button');
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await page.evaluate(() => { history.pushState({}, '', '/programs'); dispatchEvent(new PopStateEvent('popstate')); });
  await page.getByRole('heading', { name: 'Programs & Opportunities', exact: true }).waitFor();
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden'); checks.push('navigation with open dialog cleanup');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open menu' }).click();
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.keyboard.press('Escape');
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'About', exact: true }).click();
  await page.waitForURL('**/#about');
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  checks.push('mobile menu Escape and anchor, reduced motion, no horizontal overflow');
  failCourses = true;
  await page.goto('http://127.0.0.1:4173/programs');
  await page.getByRole('alert').filter({ hasText: 'Courses could not be loaded' }).waitFor(); checks.push('API failure state');
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ checks, pageErrors: errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
