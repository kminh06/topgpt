import React, { useState, useEffect, useRef } from "react"
import { openai } from "@/config/openai"
import Head from "next/head"
import { useAuth } from "@/AuthContext"
import { useRouter } from "next/router"
import { doc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/config/firebase"
import Image from "next/image"
import GPTLogo from "@/components/GPTLogo"
import Header from "@/components/Header"
import Welcome from "@/components/Welcome"

export default function Home() {
  const [text, setText] = useState('')
  const [session, setSession] = useState([
    { "role": "system", "content": "You are TopGPT, a helpful assistant powered by OpenAI and created by Khac Minh Dau." }
  ])
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  const bottom = useRef(null)
  const [x, setX] = useState(true)
  const list = [
    {
      prompt: 'Explain technical concepts',
      question: 'What is a "serverless function"?'
    },
    {
      prompt: 'Summarize an article',
      question: 'Summarize the following article for a 2nd grader:'
    },
    {
      prompt: 'Draft an email',
      question: 'Draft an email to my boss about the following:'
    }
  ]

  function scrollToBottom() {
    bottom.current?.scrollIntoView()
  }

  useEffect(() => {
    scrollToBottom()
  }, [session, x])
  
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

  console.log(session)

  function handleSubmit(text) {
    setText('')
    session.push({ "role": "user", "content": text })
    setX(!x)
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
        <span><img alt='user' id='user' className='pic' src={user.photoURL} />{message.content}</span>
      </div>
    } else if (message.role === 'assistant') {
      return <div className='message'>
        <span><span className='pic'><GPTLogo /></span>{message.content}</span>
      </div>
    } else {}
  }

  return (
    (!loading) ? <div className='Home'>
      <Head>
        <title>Chat | TopGPT</title>
      </Head>
      <Header button={<button className='btn small' onClick={(e) => {
          e.preventDefault();
          logout()
        }}>Log Out</button>} />
      <div id='content'>
        <div id='message-container'>
          {session.map((message) => generateMessage(message))}
          <div id='hider' ref={bottom}></div>
        </div>
        {(session.length < 2) ? <Welcome list={
          <ul id='prompts-list'>
            {list.map((item) => <li className='prompt' key={item.prompt} onClick={(e) => {
              e.preventDefault();
              setText(item.question)
            }}>
              {item.prompt}
            </li>)}
          </ul>
        } /> : <></>}
        <div id='chat-box'>
          {(user.has_paid) ? <>
            <input id='chat-input' type='text' autoComplete='off' placeholder='Ask me something.' value={text} onChange={(e) => {setText(e.target.value)}} onKeyDown={(e) => {
              if (e.key === 'Enter' && text !== '') {
                handleSubmit(text)
              }
            }} />
            <img className={(text) ? '' : 'disabled'} onClick={(e) => {
              e.preventDefault()
              if (text) {
                handleSubmit(text)
              }
            }} src='/send.svg' id='send' />
          </> : <>
            <input id='chat-input' type='text' disabled='disabled' autoComplete='off' placeholder='Please make payment to chat'  style={{cursor: 'not-allowed'}} />
            <img className={'disabled'} src='/send.svg' id='send' />
          </>
          }
        </div>
      </div>
    </div> : <div>Loading ...</div>
  )
}
