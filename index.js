/* eslint-disable no-global-assign */
/**
 * This is the entry point for our pdsa-server as it wraps the application with ESM allowing us to use ES6 without Babel.
 */
require = require('esm')(module /* , options */);
module.exports = require('./server.js');
