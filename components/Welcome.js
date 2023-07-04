import React from 'react'

export default function Welcome(props) {
  return (
    <div className='Welcome'>
      <h1>Welcome to TopGPT: Quantum!</h1>
      <p style={{ color: 'var(--white)' }}>
        You can start a conversation here or try the following examples:
      </p>
      {props.list}
    </div>
  )
}
