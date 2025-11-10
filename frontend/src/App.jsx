import React from 'react'
import Dashboard from './components/Dashboard'

export default function App(){
  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', padding: 20 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1>GreenLink 2.0</h1>
        <div style={{ background:'#e6f7e6', padding:'8px 12px', borderRadius:8 }}>GreenScore: <strong id="greenscore">—</strong></div>
      </header>
      <main style={{ marginTop:20 }}>
        <Dashboard />
      </main>
    </div>
  )
}
