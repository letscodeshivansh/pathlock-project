import React, {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import api from '../services/api';

export default function Dashboard(){
  const [projects, setProjects] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  async function load(){
    const res = await api.get('/api/v1/projects')
    setProjects(res.data)
  }

  useEffect(()=>{ load() }, [])

  async function create(e: React.FormEvent){
    e.preventDefault()
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
      <form onSubmit={create} className="mb-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 mr-2" />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="border p-2 mr-2" />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
      </form>

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
    </div>
  )
}
