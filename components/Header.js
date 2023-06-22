import React from 'react'
import Image from 'next/image'

export default function Header(props) {
  return (
    <div className='Header'>
      <Image src={'/chat.png'} width={50} height={50} style={{ position: 'absolute', left: '8px', top: '8px'}}></Image>
      <span id='title' style={{ fontSize: '25px', fontWeight: 'bolder' }}>TopGPT Quantum</span>
      {props.button}
    </div>
  )
}
