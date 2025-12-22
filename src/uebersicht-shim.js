/**
 * Übersicht Module Shim
 * 
 * Provides the same exports as the real 'uebersicht' module so widgets
 * can be rendered in a browser debugging environment.
 * 
 * Real module exports: { run, request, css, styled, React }
 */

import { css } from 'emotion';
import styled from '@emotion/styled';
// Note: React is auto-injected by Vite's jsxInject, but we need it as a named export
import ReactModule from 'react';
const React = ReactModule;

/**
 * Mock shell command runner
 * In the real Übersicht, this executes shell commands and returns the output.
 * Here we just log and return empty - the harness provides simulated output.
 * 
 * @param {string} command - Shell command to "run"
 * @returns {Promise<string>} - Resolves with empty string (or rejected with error)
 */
export const run = (command) => {
  console.log('[uebersicht:run] Would execute:', command);
  return Promise.resolve('');
};

/**
 * Mock HTTP request function
 * In the real Übersicht, this is superagent.
 * Here we provide a minimal mock that logs requests.
 */
export const request = {
  get: (url) => {
    console.log('[uebersicht:request] GET', url);
    return {
      set: () => request.get(url),
      then: (cb) => Promise.resolve({ body: {} }).then(cb),
      catch: (cb) => Promise.resolve({ body: {} }).catch(cb),
    };
  },
  post: (url) => {
    console.log('[uebersicht:request] POST', url);
    return {
      send: () => request.post(url),
      set: () => request.post(url),
      then: (cb) => Promise.resolve({ body: {} }).then(cb),
      catch: (cb) => Promise.resolve({ body: {} }).catch(cb),
    };
  },
};

export { css, styled, React };

// Also export React as default for `import React from 'uebersicht'` patterns
export default { run, request, css, styled, React };

