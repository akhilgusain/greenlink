import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'

export default function Dashboard(){
  const [data, setData] = useState({ builds: [], greenScore: '-' })
  useEffect(()=>{ fetchStats() }, [])
  async function fetchStats(){
    try{
      const res = await axios.get('/api/stats') // proxy to backend in dev
      setData(res.data)
      const gs = document.getElementById('greenscore')
      if(gs) gs.innerText = res.data.greenScore
    }catch(err){
      console.error(err)
    }
  }

  const builds = data.builds.map(b => ({ name: new Date(b.timestamp).toLocaleDateString(), kgCO2: b.kgCO2, duration: b.durationSec }))

  return (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
      <section style={{ background:'#fff', padding:16, borderRadius:8 }}>
        <h3>CO₂ per Build (kg)</h3>
        <LineChart width={600} height={300} data={builds}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="kgCO2" stroke="#82ca9d" />
        </LineChart>

        <h3 style={{ marginTop:20 }}>Build Duration (sec)</h3>
        <BarChart width={600} height={200} data={builds}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="duration" />
        </BarChart>
      </section>

      <aside style={{ background:'#fff', padding:16, borderRadius:8 }}>
        <h3>Smart Tips</h3>
        <ul>
          <li>Enable dependency caching in CI.</li>
          <li>Split large workflows into smaller jobs.</li>
          <li>Run nightly heavy jobs off-peak.</li>
        </ul>
        <h4 style={{ marginTop:16 }}>Top energy-heavy workflows</h4>
        <ol>
          {data.builds.slice().sort((a,b)=>b.kgCO2-a.kgCO2).slice(0,3).map(b=> <li key={b.id}>{b.repo} — {b.kgCO2} kg</li>)}
        </ol>
      </aside>
    </div>
  )
}
