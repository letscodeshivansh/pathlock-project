import React, { useState } from 'react'
import api from '../services/api'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/v1/auth/register', { username, password })
      localStorage.setItem('token', res.data.token)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.error || 'Register failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit}>
        <label className="block mb-2">Username
          <input value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-2" />
        </label>
        <label className="block mb-2">Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2" />
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  )
}
