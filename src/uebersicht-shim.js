/**
 * Übersicht Module Shim
 *
 * Provides the same exports as the real 'uebersicht' module so widgets
 * can be rendered in a browser debugging environment.
 *
 * Real module exports: { run, request, css, styled, React }
 */

import styled from "@emotion/styled";
import { css } from "emotion";
// Note: React is auto-injected by Vite's jsxInject, but we need it as a named export
import ReactModule from "react";
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
  console.log("[uebersicht:run] Would execute:", command);
  return Promise.resolve("");
};

/**
 * Mock HTTP request function
 * In the real Übersicht, this is superagent.
 * Here we provide a minimal mock that logs requests.
 */
export const request = {
  /**
   * @param {string} url
   */
  get: (url) => {
    console.log("[uebersicht:request] GET", url);
    return {
      /** @param {(reason: unknown) => void} cb */
      catch: (cb) => Promise.resolve({ body: {} }).catch(cb),
      set: () => request.get(url),
      /** @param {(value: { body: object }) => void} cb */
      then: (cb) => Promise.resolve({ body: {} }).then(cb),
    };
  },
  /**
   * @param {string} url
   */
  post: (url) => {
    console.log("[uebersicht:request] POST", url);
    return {
      /** @param {(reason: unknown) => void} cb */
      catch: (cb) => Promise.resolve({ body: {} }).catch(cb),
      send: () => request.post(url),
      set: () => request.post(url),
      /** @param {(value: { body: object }) => void} cb */
      then: (cb) => Promise.resolve({ body: {} }).then(cb),
    };
  },
};

export { css, React, styled };

// Also export React as default for `import React from 'uebersicht'` patterns
export default { css, React, request, run, styled };
