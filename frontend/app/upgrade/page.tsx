'use client'

export default function UpgradePage() {
  return (
    <main className="min-h-screen p-20">
      <h1 className="text-4xl font-bold mb-4">Upgrade to Plus</h1>
      <p className="opacity-70 mb-8">Unlock auto-fixes, diffs and effort estimation.</p>

      <button
        onClick={() => {
          localStorage.setItem('crai_license', 'CRAI-PRO-2025')
          window.location.href = '/review?mode=pro'
        }}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500"
      >
        Buy PRO
      </button>

      <p className="text-xs opacity-40 mt-2">Demo unlock, no payment required.</p>
    </main>
  )
}
