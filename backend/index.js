const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for demo purposes
const builds = [
  { id: 'b1', repo: 'greenlink/demo', durationSec: 120, cpuSeconds: 300, timestamp: Date.now() - 1000*60*60*24*2 },
  { id: 'b2', repo: 'greenlink/demo', durationSec: 600, cpuSeconds: 1200, timestamp: Date.now() - 1000*60*60*24 },
  { id: 'b3', repo: 'greenlink/demo', durationSec: 90, cpuSeconds: 180, timestamp: Date.now() }
];

// Simple estimator: kWh = cpuSeconds * factor -> CO2 = kWh * 0.4 kgCO2/kWh
function estimateCO2(cpuSeconds) {
  // rough mapping: 1 CPU-second ~ 0.00005 kWh (very approximate)
  const kWh = cpuSeconds * 0.00005;
  const kgCO2 = kWh * 0.4;
  return { kWh: +kWh.toFixed(5), kgCO2: +kgCO2.toFixed(5) };
}

app.get('/api/stats', (req, res) => {
  const results = builds.map(b => {
    const e = estimateCO2(b.cpuSeconds);
    return { ...b, kWh: e.kWh, kgCO2: e.kgCO2 };
  });
  // GreenScore: simple heuristic (higher is better). Normalized to 0-100
  const avgKg = results.reduce((s,r)=>s+r.kgCO2,0)/results.length;
  const greenScore = Math.max(0, Math.round(100 - avgKg*1000));
  res.json({ builds: results, greenScore });
});

// ingest endpoint (used by CI plugin)
app.post('/api/ingest', (req, res) => {
  const payload = req.body || {};
  if(!payload.id || !payload.cpuSeconds) return res.status(400).json({ error: 'missing id or cpuSeconds' });
  const entry = {
    id: payload.id,
    repo: payload.repo || 'unknown/repo',
    durationSec: payload.durationSec || 0,
    cpuSeconds: payload.cpuSeconds,
    timestamp: payload.timestamp || Date.now()
  };
  builds.push(entry);

  // optional: send slack tip (placeholder)
  if(process.env.SLACK_WEBHOOK_URL) {
    // lightweight fire-and-forget
    const fetch = require('node-fetch');
    const e = estimateCO2(entry.cpuSeconds);
    const body = { text: `New build ingested: ${entry.repo} — estimated ${e.kgCO2} kg CO2` };
    fetch(process.env.SLACK_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'} })
      .catch(err=>console.error('slack send failed',err));
  }

  res.json({ status: 'ok', entry });
});

app.listen(port, ()=>console.log(`GreenLink backend listening on ${port}`));
