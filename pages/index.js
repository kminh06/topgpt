import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import { useAuth } from "@/AuthContext"
import { useRouter } from "next/router"
import Image from "next/image"
import Anon from '../download.png'
import GPTLogo from "@/components/GPTLogo"
import Header from "@/components/Header"

export default function Home() {
  const [session, setSession] = useState([{
    prompt: 'Explain quantum computing in simple terms',
    result: 'Quantum computing is a type of computing that uses quantum-mechanical phenomena, such as superposition and entanglement, to perform operations on data. It is different from traditional computing, which uses binary bits (ones and zeros) to represent and process information. In quantum computing, information is represented by qubits (quantum bits) which can exist in multiple states simultaneously. This allows quantum computers to process and store much more information than traditional computers, and to solve certain problems much faster.'
  }])
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const bottom = useRef(null)
  
  useEffect(() => {
    if (currentUser) {
      router.push('/chat')
    } else {
      setLoading(false)
    }
  }, [])

  return (
    (!loading) ? <div className='Home'>
      <Head>
        <title>Chat | TopGPT</title>
      </Head>
      <Header button={<button className='btn small' onClick={(e) => {
          e.preventDefault();
          router.push('/login')
        }}>Log In</button>} />
      <div id='content'>
        <div id='chat-box'>
          <input type='text' disabled='disabled' autoComplete='off' placeholder='This is a demo! Please log in.' id='chat-input' style={{cursor: 'not-allowed'}} />
        </div>
        <div id='message-container'>
          {session.map((convo) => 
            <div className='message-group' key={session.indexOf(convo)}>
              <div className='message'>
                <span><Image alt='Anonymous' className='pic' src={Anon} width={40} />{convo.prompt}</span>
              </div>
              <div className='message' style={{whiteSpace: 'pre-line'}}>
                <span><span className='pic'><GPTLogo /></span>{convo.result}</span>
              </div>
            </div>
          )}
          <div id='hider' ref={bottom}></div>
        </div>
      </div>
    </div> : <div>Loading ...</div>
  )
}
