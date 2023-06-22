import React from 'react'

export default function Shutdown() {
  return (
    <div className='Shutdown' style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div className='Header' style={{ position: 'absolute', top: '0'}}>
        <span style={{ fontSize: '40px', fontWeight: 'bolder' }}>TopGPT 2.0</span>
        <span style={{ fontSize: '15px' }}>Using OpenAI's GPT-3.5-Turbo engine</span>
      </div>
      <div style={{ margin: '0 20%'}}>
        <h1>Sorry, we're shut down.</h1>
        <h2>Please check back soon!</h2>
      </div>
    </div>
  )
}
