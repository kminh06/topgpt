import React from 'react'
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter()
  
  return (
    <div className='Header'>
      <span style={{ fontSize: '40px', fontWeight: 'bolder' }}>TopGPT 2.0</span>
      <span style={{ fontSize: '15px' }}>Using OpenAI's GPT-3.5-Turbo engine</span>
      <button className='btn logout' onClick={(e) => {
        e.preventDefault();
        router.push('/login')
      }}>Log In</button>
    </div>
  )
}
