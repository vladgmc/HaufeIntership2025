'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AccountPanel(){
  const [email,setEmail] = useState<string|null>(null)
  const [pro,setPro] = useState(false)

  useEffect(()=>{
    const u = localStorage.getItem('user_email')
    const lic = localStorage.getItem('crai_license')

    if(u) setEmail(u)
    if(lic==='CRAI-PRO-2025') setPro(true)
  },[])

  if(!email) return null

  return(
    <motion.div
      initial={{ opacity:0, y:40 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4 }}
      className="fixed bottom-6 right-6 bg-[var(--card)] shadow-xl rounded-2xl p-4 w-64 border border-white/10 text-sm"
    >
      <div className="font-semibold mb-1">Logged in</div>
      <div className="opacity-80 mb-2">{email}</div>

      {pro ? (
        <div className="bg-green-600/30 text-green-300 px-2 py-1 rounded-lg text-xs inline-block">
          PRO active ✅
        </div>
      ) : (
        <div className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded-lg text-xs inline-block">
          Free plan
        </div>
      )}
    </motion.div>
  )
}
