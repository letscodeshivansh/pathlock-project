import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import api from '../services/api';
import { isAuthenticated } from '../services/auth';

export default function Dashboard(){
  const [projects, setProjects] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{ if(!isAuthenticated()) navigate('/login'); load() }, [])

  async function load(){
    setLoading(true)
    const res = await api.get('/api/v1/projects')
    setProjects(res.data)
    setLoading(false)
  }

  async function create(e: React.FormEvent){
    e.preventDefault()
    if(!title) return
    await api.post('/api/v1/projects', { title, description: desc })
    setTitle(''); setDesc('')
    load()
  }

  async function del(id: number){
    if(!confirm('Delete project?')) return
    await api.delete(`/api/v1/projects/${id}`)
    load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Projects</h2>
      <form onSubmit={create} className="mb-4 flex gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 flex-1" />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="border p-2 flex-1" />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <div className="grid gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <Link to={`/projects/${p.id}`} className="font-bold">{p.title}</Link>
                  <div className="text-sm text-gray-600">{p.description}</div>
                </div>
                <div>
                  <button onClick={()=>del(p.id)} className="text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
