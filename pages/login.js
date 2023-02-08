import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../AuthContext'
import { GoogleAuthProvider } from 'firebase/auth'

export default function Login() {
  const { currentUser, authenticate } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    if (currentUser) {
      router.push('/')
    } else {
      setLoading(false)
    }
  }, [])

  return (
    (!loading) ? <div className='Login'>
      <Head>
        <title>Login | TopGPT</title>
      </Head>
      <h1>Login</h1>
      <button onClick={(e) => {
        e.preventDefault();
        authenticate(googleProvider)
      }}>Login with Google</button>
    </div> : <div>Loading ...</div>
  )
}
