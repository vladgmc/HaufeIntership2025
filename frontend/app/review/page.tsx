"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Wand2, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

export default function ReviewPage() {

  const qs = useSearchParams()
  const initialMode = qs.get('mode') === 'pro' ? 'pro' : 'free'

  const [code, setCode]      = useState('')
  const [mode, setMode]      = useState<'free'|'pro'>(initialMode as any)
  const [loading, setLoading]= useState(false)
  const [result, setResult]  = useState<string>('')
  const [style, setStyle]    = useState<'none'|'pep8'|'google'>('none')
  const [effort, setEffort]  = useState<string | null>(null)

  const canSubmit = useMemo(() => code.trim().length > 0 && !loading, [code, loading])

  const onPickFile = async (f: File | null) => {
    if (!f) return
    const text = await f.text()
    setCode(text)
  }

  const onSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setResult('')
    setEffort(null)

    try {
      const license = localStorage.getItem('crai_license') || ''
      const res = await fetch(`${API_BASE}/api/review`,{
        method:'POST',
        headers:{'Content-Type':'application/json','x-license-key':license},
        body:JSON.stringify({ code, mode, diffOnly:true, style })
      })
      const json = await res.json()
      setResult(json.review ?? 'No response')

      // extract effort
      const m = json.review?.match(/effort.*?:\s*(.+)/i)
      setEffort(m ? m[1].trim() : null)

    } catch(e:any){
      setResult('Error contacting backend. Is it running? '+ e?.message)
    } finally{ setLoading(false) }
  }

  const onFix = async () => {
    if (!canSubmit) return
    setLoading(true)
    setResult('')
    try {
      const license = localStorage.getItem('crai_license') || ''
      const res = await fetch(`${API_BASE}/api/fix`,{
        method:'POST',
        headers:{'Content-Type':'application/json','x-license-key':license},
        body:JSON.stringify({ code, mode:'pro' })
      })
      const json = await res.json()
      setResult(json.patch ?? 'No patch returned')
    } catch(e:any){
      setResult('Error contacting backend. '+ e?.message)
    } finally{ setLoading(false) }
  }

  return(
  <main className="min-h-screen max-w-6xl mx-auto px-6 py-12">
    
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Code Review</h1>
      <div className="flex items-center gap-3">
        <button onClick={()=>setMode('free')} className={`px-4 py-2 rounded-xl ${mode==='free'?'bg-white/20':'bg-white/10'}`}>Free</button>
        <button onClick={()=>setMode('pro')}  className={`px-4 py-2 rounded-xl ${mode==='pro'?'bg-blue-600':'bg-white/10'}`}>Plus</button>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mt-8">

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-[var(--card)] rounded-2xl p-4">

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4"/> Paste code</h2>
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20">
            <Upload className="w-4 h-4"/> Upload file
            <input type="file" hidden onChange={(e)=>onPickFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <textarea
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          placeholder="Paste your code here or upload a file..."
          className="w-full h-80 bg-black/30 rounded-xl p-3 outline-none resize-y"
        />

        <div className="mt-3 flex gap-2">
          <button onClick={()=>{setStyle('none');onSubmit();}}   className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50" disabled={!canSubmit}>{loading?<Loader2 className="w-4 h-4 animate-spin"/>:<Wand2 className="w-4 h-4"/>}Analyze</button>
          <button onClick={()=>{setStyle('pep8');onSubmit();}}   className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50" disabled={!canSubmit}>PEP8</button>
          <button onClick={()=>{setStyle('google');onSubmit();}} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50" disabled={!canSubmit}>Google Style</button>
        </div>

        <button onClick={onFix} disabled={!canSubmit||mode!=='pro'} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-30">Auto-Fix</button>
        <button
          onClick={() => { setStyle('none'); onSubmit(); }}
          disabled={!canSubmit}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
        >
  Analyze DIFF only
</button>

      </motion.div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-[var(--card)] rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Review result</h2>

        {effort && (
          <div className="mb-3 inline-block px-3 py-1 rounded-lg bg-white/10 text-sm text-green-400">
            Effort: {effort}
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {result ? <pre className="whitespace-pre-wrap">{result}</pre> : <p className="text-slate-400">Results will appear here...</p>}
        </div>
      </motion.div>

    </div>
  </main>
  )
}
