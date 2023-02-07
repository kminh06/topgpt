import React, { useState, useEffect } from "react"
import { openai } from "@/openai-config"
import Head from "next/head"

export default function Home() {
  const [result, setResult] = useState('')
  const [text, setText] = useState('')
  const [session, setSession] = useState([])

  function handleSubmit(text) {
    setText('')
    setSession([...session, { prompt: text, result: '' }])
    openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 100,
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
    <div className='Home'>
      <Head>
        <title>TopGPT</title>
      </Head>
      <div className='Header'>
        <span style={{ fontSize: '40px', fontWeight: 'bolder' }}>TopGPT</span>
        <span style={{ fontSize: '15px' }}>Using OpenAI's GPT-3 engine</span>
      </div>
      <div id='content'>
        <div style={{width: '100%'}}>
          <input type='text' placeholder='Ask me anything ...' id='chat-box' value={text} onChange={(e) => {setText(e.target.value)}} onKeyDown={(e) => {
            if (e.key === 'Enter' && text !== '') {
              handleSubmit(text)
            }
          }} />
        </div>
        <div id='message-container'>{session.map((convo) => 
          <div className='message-group' key={session.indexOf(convo)}>
            <b>{convo.prompt}</b>
            <p style={{whiteSpace: 'pre-line'}}>{convo.result}</p>
          </div>
        )}</div>
      </div>
    </div>
  )
}
