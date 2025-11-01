'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Rocket } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {

  const [pro, setPro] = useState(false)

  useEffect(()=>{
    const lic = localStorage.getItem('crai_license')
    if(lic === 'CRAI-PRO-2025') setPro(true)
  },[])

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight"
        >
          CodeReview <span className="text-blue-400">AI</span>
        </motion.h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl">
          Ship cleaner code faster. Automatic reviews powered by your local LLM — privacy-first, blazing fast.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/review" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium">
            Try it free
          </Link>
          <a href="#pricing" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium">
            See pricing
          </a>
        </div>
      </section>

      <section id="pricing" className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold mb-6">Pricing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 bg-[var(--card)] shadow-lg">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-slate-400 mt-1">Great for quick feedback</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/>Inline advice</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/>Best practices</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/>No cloud, all local</li>
            </ul>
            <Link href="/review" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">
              Get started
              <Rocket className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl p-6 bg-[var(--card)] shadow-lg border border-blue-500/40">
            <h3 className="text-xl font-semibold">Plus — 20€/month</h3>
            <p className="text-slate-400 mt-1">Advanced refactors & insights</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/>Auto-fix patches (diff)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/>Effort estimates</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400"/>Doc update suggestions</li>
            </ul>

            {!pro && (
              <Link href="/upgrade" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500">
                Upgrade to Plus
                <Rocket className="w-4 h-4" />
              </Link>
            )}

            {pro && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600">
                You already have PRO ✅
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  )
}
