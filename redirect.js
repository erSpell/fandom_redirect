/* global browser */

'use strict';

const FANDOM_SUFFIX = '.fandom.com';
const ANTIFANDOM_SUFFIX = '.antifandom.com';

function buildAntifandomUrl(inputUrl) {
  const url = new URL(inputUrl);
  const hostname = url.hostname.toLowerCase();

  if (!hostname.endsWith(FANDOM_SUFFIX)) {
    return null;
  }

  // Only redirect actual wiki article/special-page paths. This avoids sending
  // non-wiki pages like www.fandom.com, auth pages, or corporate pages to a
  // matching but likely invalid Antifandom subdomain.
  if (!url.pathname.startsWith('/wiki/')) {
    return null;
  }

  const wikiName = hostname.slice(0, -FANDOM_SUFFIX.length);

  // Avoid malformed redirects for bare fandom.com or wildcard oddities.
  if (!wikiName || wikiName.includes('..')) {
    return null;
  }

  url.hostname = `${wikiName}${ANTIFANDOM_SUFFIX}`;
  url.protocol = 'https:';
  return url.toString();
}

function redirectToAntifandom(details) {
  const redirectUrl = buildAntifandomUrl(details.url);

  if (!redirectUrl || redirectUrl === details.url) {
    return {};
  }

  return { redirectUrl };
}

browser.webRequest.onBeforeRequest.addListener(
  redirectToAntifandom,
  { urls: ['*://*.fandom.com/wiki/*'], types: ['main_frame'] },
  ['blocking']
);

// Export for the local Node-based test runner without affecting Firefox.
if (typeof module !== 'undefined') {
  module.exports = { buildAntifandomUrl, redirectToAntifandom };
}
