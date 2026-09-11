'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const redirectSource = fs.readFileSync('./redirect.js', 'utf8');
const sandbox = {
  URL,
  module: { exports: {} },
  browser: {
    webRequest: {
      onBeforeRequest: {
        addListener() {}
      }
    }
  }
};
vm.runInNewContext(redirectSource, sandbox, { filename: 'redirect.js' });

const { buildAntifandomUrl, redirectToAntifandom } = sandbox.module.exports;

const cases = [
  [
    'https://minecraft.fandom.com/wiki/Dirt',
    'https://minecraft.antifandom.com/wiki/Dirt'
  ],
  [
    'http://starwars.fandom.com/wiki/Luke_Skywalker?so=search',
    'https://starwars.antifandom.com/wiki/Luke_Skywalker?so=search'
  ],
  [
    'https://community.fandom.com/wiki/Community_Central',
    'https://community.antifandom.com/wiki/Community_Central'
  ]
];

for (const [input, expected] of cases) {
  assert.equal(buildAntifandomUrl(input), expected);
}

assert.equal(buildAntifandomUrl('https://fandom.com/'), null);
assert.equal(buildAntifandomUrl('https://www.fandom.com/'), null);
assert.equal(buildAntifandomUrl('https://minecraft.fandom.com/'), null);
assert.equal(buildAntifandomUrl('https://example.com/wiki/Dirt'), null);
const redirected = redirectToAntifandom({ url: 'https://zelda.fandom.com/wiki/Link' });
assert.equal(redirected.redirectUrl, 'https://zelda.antifandom.com/wiki/Link');

const notRedirected = redirectToAntifandom({ url: 'https://example.com/' });
assert.equal(Object.keys(notRedirected).length, 0);

console.log('All redirect tests passed.');
