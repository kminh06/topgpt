import React, { useState, useEffect } from "react"
import { openai } from "@/config/openai"
import Head from "next/head"
import { useAuth } from "@/AuthContext"
import { useRouter } from "next/router"
import { getDoc, doc, setDoc } from "firebase/firestore"
import { db } from "@/config/firebase"
import Image from "next/image"
import chatgpt from '../chatgpt.png'

export default function Home() {
  const [text, setText] = useState('')
  const [session, setSession] = useState([])
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  
  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    } else {
      const docRef = doc(db, 'users', currentUser.uid)
      getDoc(docRef)
        .then((doc) => {
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

  useEffect(() => {
    openai.listEngines().then((res) => {
      console.log(res)
    })
    console.log('list')
  }, [])

  function handleSubmit(text) {
    setText('')
    setSession([...session, { prompt: text, result: 'Thinking ...' }])
    openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 500,
      temperature: 0,
    }).then((response) => {
      const answer = response.data.choices[0].text.slice(2)
      console.log(answer)
      console.log(response)
      setSession([...session, { prompt: text, result: answer }])
    }).catch((error) => {
      console.log(error)
      setSession([...session, { prompt: text, result: 'Could not answer, please try again' }])
    })
  }

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
        <div id='message-container'>{session.map((convo) => 
          <div className='message-group' key={session.indexOf(convo)}>
            <div className='message'>
              <span style={{fontStyle: 'italic'}}><img className='pic' src={user.photoURL} />{convo.prompt}</span>
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
