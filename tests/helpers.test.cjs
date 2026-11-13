const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
function load(file, globals = {}) {
  const source = fs.readFileSync(file, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {}, ...globals };
  vm.runInNewContext(output, context);
  return context.exports;
}
test('registration links reject unsafe schemes and placeholders', () => {
  const { safeLink } = load('src/utils/links.ts', { URL });
  for (const url of [undefined, '', '#', 'javascript:alert(1)', 'data:text/html,test', '//evil.example', '/\\evil', 'https://bad.example/\nattack']) assert.equal(safeLink(url), undefined, url);
  assert.equal(safeLink('/programs'), '/programs');
  assert.equal(safeLink('#contact'), '/#contact');
  assert.equal(safeLink('https://example.org/event'), 'https://example.org/event');
  assert.equal(safeLink('/volunteer_form/'), 'https://volunteer.foroz.me/');
});
test('overlapping scroll locks restore original styles exactly once', () => {
  const style = { overflow: 'auto', paddingRight: '4px' };
  const { lockScroll } = load('src/utils/scrollLock.ts', { document: { body: { style }, documentElement: { clientWidth: 980 } }, window: { innerWidth: 1000 } });
  const releaseMenu = lockScroll(); const releaseModal = lockScroll();
  assert.equal(style.overflow, 'hidden');
  assert.equal(style.paddingRight, '20px');
  releaseMenu(); releaseMenu();
  assert.equal(style.overflow, 'hidden');
  releaseModal();
  assert.equal(style.overflow, 'auto');
  assert.equal(style.paddingRight, '4px');
  lockScroll()();
  assert.equal(style.overflow, 'auto');
});
