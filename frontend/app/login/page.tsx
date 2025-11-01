'use client'

import { useState } from 'react'

export default function LoginPage(){

  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [msg,setMsg] = useState('')

  // conturile demo locale
  // pro user: pro@example.com / 123
  // free user: free@example.com / 123

  const onLogin = () => {

    if(email==='pro@example.com' && pass==='123'){
     localStorage.setItem('user_email', email)
     localStorage.setItem('crai_license','CRAI-PRO-2025')     
      setMsg('PRO activat ✅')
      setTimeout(()=>{ window.location.href='/' },700)
      return
    }

    if(email==='free@example.com' && pass==='123'){
     localStorage.setItem('user_email', email)
     localStorage.removeItem('crai_license')      
      setMsg('Logat free ⭐')
      setTimeout(()=>{ window.location.href='/' },700)
      return
    }

    setMsg('Credentiale invalide ❌')
  }

  return(
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-[var(--card)] p-8 rounded-2xl w-[360px] shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <input
          className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 outline-none"
          placeholder="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 outline-none"
          type="password"
          placeholder="password"
          value={pass}
          onChange={e=>setPass(e.target.value)}
        />

        <button
          onClick={onLogin}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
        >
          Login
        </button>

        {msg && <p className="mt-3 text-center">{msg}</p>}
      </div>
    </main>
  )
}
