import React, { createContext, useContext, useState, useEffect } from "react"
import { auth, db } from "@/config/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  function authenticate(provider, method) {
    signInWithPopup(auth, provider)
      .then(() => {
        router.push('/chat')
      })
  }

  function logout() {
    signOut(auth)
      .then(() => {
        router.push('/login')
      })
      .catch((error) => {
        console.log(error.code)
      })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    authenticate,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}