import React, { useState, useEffect } from "react"
import { openai } from "@/config/openai"
import Head from "next/head"
import { useAuth } from "@/AuthContext"
import { useRouter } from "next/router"
import { getDoc, doc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/config/firebase"
import Image from "next/image"
import chatgpt from '../chatgpt.png'
import Anon from '../download.png'

export default function Home() {
  const [text, setText] = useState('')
  const [session, setSession] = useState([{
    prompt: 'Explain quantum computing in simple terms',
    result: 'Quantum computing is a type of computing that uses quantum-mechanical phenomena, such as superposition and entanglement, to perform operations on data. It is different from traditional computing, which uses binary bits (ones and zeros) to represent and process information. In quantum computing, information is represented by qubits (quantum bits) which can exist in multiple states simultaneously. This allows quantum computers to process and store much more information than traditional computers, and to solve certain problems much faster.'
  }])
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  
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
      <div className='Header'>
        <span style={{ fontSize: '40px', fontWeight: 'bolder' }}>TopGPT</span>
        <span style={{ fontSize: '15px' }}>Using OpenAI's GPT-3 engine</span>
        <button className='btn logout' onClick={(e) => {
          e.preventDefault();
          router.push('/login')
        }}>Log In</button>
      </div>
      <div id='content'>
        <div style={{width: '100%'}}>
          <input type='text' disabled='disabled' autoComplete='off' placeholder='This is a demo! Please log in.' id='chat-box' style={{cursor: 'not-allowed'}} />
        </div>
        <div id='message-container'>{session.map((convo) => 
          <div className='message-group' key={session.indexOf(convo)}>
            <div className='message'>
              <span><Image className='pic' src={Anon} width={40} />{convo.prompt}</span>
            </div>
            <div className='message' style={{whiteSpace: 'pre-line'}}>
              <span><Image className='pic' src={chatgpt} width={40} />{convo.result}</span>
            </div>
          </div>
        )}</div>
      </div>
    </div> : <div>Loading ...</div>
  )
}
