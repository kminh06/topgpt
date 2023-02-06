import React, { useState, useEffect } from "react"
import { openai } from "@/openai-config"

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
      console.log(response.data.choices[0].text)
      console.log(response)
      setResult(response.data.choices[0].text)
      setSession([...session, { prompt: text, result: response.data.choices[0].text }])
    }).catch((error) => {
      console.log(error)
      setSession([...session, { prompt: text, result: 'Could not answer, please try again' }])
    })
  }

  return (
    <div>
      <h1>CheatGPT</h1>
      <div id='content'>
        <div style={{width: '100%'}}>
          <textarea placeholder='Ask me anything ...' id='chat-box' value={text} onChange={(e) => {setText(e.target.value)}} />
          <button onClick={(e) => {
          e.preventDefault();
          handleSubmit(text)
        }}>Submit</button>
        </div>
        <div>{session.map((convo) => 
          <div>
            <b>{convo.prompt}</b>
            <p>{convo.result}</p>
          </div>
        )}</div>
      </div>
    </div>
  )
}
