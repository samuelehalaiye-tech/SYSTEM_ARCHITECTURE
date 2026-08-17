// Stub all lucide icons as no-ops
const React = require('react');
const Icon = () => null;

module.exports = new Proxy({}, {
  get: () => Icon,
});
