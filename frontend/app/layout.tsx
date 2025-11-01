'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AccountBadge from '../components/AccountBadge'
import AccountPanel from '../components/AccountPanel'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<string | null>(null)
  const [pro, setPro] = useState<boolean>(false)
  const [open, setOpen] = useState(false)


  useEffect(() => {
    const u = localStorage.getItem('user_email')
    const license = localStorage.getItem('crai_license')

    if (u) setUser(u)
    setPro(license === 'CRAI-PRO-2025')
  }, [])

  const logout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('crai_license')
    setUser(null)
    setPro(false)
    window.location.href = '/'
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* header top bar */}
        <header className="w-full flex items-center justify-between p-4 text-sm">
          <Link href="/" className="font-bold text-xl">
            CodeReview<span className="text-blue-400">AI</span>
          </Link>


          <div className="flex items-center gap-4">
            {pro && (
              <div className="px-3 py-1 bg-green-600 rounded-xl text-xs font-semibold shadow-lg">
                PRO ACTIVE ✅
              </div>
            )}

            {user ? (
              <>
                <div className="opacity-80">{user}</div>
                <button onClick={logout} className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20">
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg">
                Login
              </Link>
            )}
          </div>
        </header>

        {/* little popup card in corner */}
        <AccountBadge />

        {children}
                {/* floating user badge */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {/* the little circle */}
            <div
              onClick={()=> setOpen(x=>!x)}
              className="w-12 h-12 rounded-full bg-white/20 border border-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition"
            >
              <span className="text-sm font-semibold select-none">
                {user ? user[0].toUpperCase() : "?"}
              </span>
            </div>

            {/* popup */}
            {open && (
              <div className="absolute bottom-14 right-0 px-4 py-3 rounded-xl bg-[#111]/90 border border-white/10 backdrop-blur-xl shadow-xl w-[210px] animate-fadeIn">
                <div className="text-sm font-semibold text-white/90 truncate">
                  {user ?? 'No user email'}
                </div>
                <div className="text-xs mt-1 font-medium">
                  {pro ? (
                    <span className="text-green-400">PRO ACTIVE ✅</span>
                  ) : (
                    <span className="text-slate-400">FREE</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>


      </body>
    </html>
  )
}
