import React, { useState, useEffect } from "react"
import { openai } from "@/config/openai"
import Head from "next/head"
import { useAuth } from "@/AuthContext"
import { useRouter } from "next/router"
import { getDoc, doc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/config/firebase"
import Image from "next/image"
import chatgpt from '../chatgpt.png'

export default function Home() {
  const [text, setText] = useState('')
  const [session, setSession] = useState([
    { "role": "system", "content": "You are TopGPT, a helpful assistant powered by OpenAI and created by Khac Minh Dau." }
  ])
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  
  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    } else {
      const docRef = doc(db, 'users', currentUser.uid)
      onSnapshot(docRef, (doc) => {
        if (doc.data() === undefined) {
          setDoc(docRef, {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            email: currentUser.email,
            date_joined: new Intl.DateTimeFormat('en-US',{month:'short', day:'numeric', year:'numeric'}).format(new Date()),
            has_paid: false
          }).then(() => {
            router.reload(window.location.pathname)
          })
        } else {
          setUser({
            email: doc.data().email,
            has_paid: doc.data().has_paid,
            photoURL: doc.data().photoURL
          })
          setLoading(false)
        }
      })
    }
  }, [])

  function handleSubmit(text) {
    setText('')
    session.push({ "role": "user", "content": text })
    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: session,
      max_tokens: 1000,
      temperature: 0,
    }).then((response) => {
      const answer = response.data.choices[0].message.content
      setSession([...session, { "role": "assistant", "content": answer }])
    }).catch((error) => {
      console.log(error)
      setSession([...session, { prompt: text, "content": 'Could not answer, please try again' }])
    })
  }

  function generateMessage(message) {
    if (message.role === 'user') {
      return <div className='message'>
        <span><img alt='user' className='pic' src={user.photoURL} />{message.content}</span>
      </div>
    } else if (message.role === 'assistant') {
      return <div className='message'>
        <span><Image alt='topgpt' className='pic' src={chatgpt} width={40} />{message.content}</span>
      </div>
    } else {}
  }

  return (
    (!loading) ? <div className='Home'>
      <Head>
        <title>Chat | TopGPT</title>
      </Head>
      <div className='Header'>
        <span style={{ fontSize: '40px', fontWeight: 'bolder' }}>TopGPT 2.0</span>
        <span style={{ fontSize: '15px' }}>Using OpenAI's GPT-3.5-Turbo engine</span>
        <button className='btn logout' onClick={(e) => {
          e.preventDefault();
          logout()
        }}>Log Out</button>
      </div>
      <div id='content'>
        <div style={{width: '100%'}}>
          {(user.has_paid) ? 
          <input type='text' autoComplete='off' placeholder='Ask me anything ...' id='chat-box' value={text} onChange={(e) => {setText(e.target.value)}} onKeyDown={(e) => {
            if (e.key === 'Enter' && text !== '') {
              handleSubmit(text)
            }
          }} /> : 
          <input type='text' disabled='disabled' autoComplete='off' placeholder='Please make payment to chat' id='chat-box' style={{cursor: 'not-allowed'}} />}
        </div>
        <div id='message-container'>{session.map((message) => 
          generateMessage(message)
        )}</div>
      </div>
    </div> : <div>Loading ...</div>
  )
}
