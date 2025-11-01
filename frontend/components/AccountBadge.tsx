'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AccountBadge() {
  const [open,setOpen] = useState(false)
  const [user,setUser] = useState<string|null>(null)
  const [pro,setPro] = useState(false)

  useEffect(()=>{
    setUser(localStorage.getItem('user_email') || null)
    setPro(localStorage.getItem('crai_license') === 'CRAI-PRO-2025')
  },[])

  const logout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('crai_license')
    window.location.href = '/'
  }

  if(!user) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* PROFILE BUTTON */}
      <div
        onClick={()=>setOpen(!open)}
        className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer flex items-center justify-center text-base font-semibold backdrop-blur-sm border border-white/10 shadow-md"
      >
        {user[0].toUpperCase()}
      </div>

      {open && (
        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          className="absolute bottom-14 right-0 w-56 bg-[var(--card)] rounded-xl p-3 text-sm shadow-xl border border-white/10"
        >
          <div className="font-medium">{user}</div>
          <div className="text-xs opacity-70 mb-3">
            Status: {pro ? 'PRO ✅' : 'FREE'}
          </div>

          <button
            onClick={logout}
            className="w-full px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-center"
          >
            Log out
          </button>
        </motion.div>
      )}
    </div>
  )
}
