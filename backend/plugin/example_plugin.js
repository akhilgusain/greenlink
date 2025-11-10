/**
 * Example plugin: send basic build metrics to GreenLink backend.
 * Use this in CI (GitHub Actions / Jenkins) by running node example_plugin.js
 *
 * Example payload keys: id, repo, durationSec, cpuSeconds, timestamp
 */
const fetch = require('node-fetch');
const url = process.env.GREENLINK_ENDPOINT || 'http://localhost:4000/api/ingest';

// Example metrics — in a real CI you'd compute CPU time & duration
const payload = {
  id: process.env.GITHUB_RUN_ID || `demo-${Date.now()}`,
  repo: process.env.GITHUB_REPOSITORY || 'greenlink/demo',
  durationSec: 180,
  cpuSeconds: 400,
  timestamp: Date.now()
};

fetch(url, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
  .then(r=>r.json())
  .then(j=>console.log('ingest response', j))
  .catch(err=>{ console.error('failed to send', err); process.exit(2); });
