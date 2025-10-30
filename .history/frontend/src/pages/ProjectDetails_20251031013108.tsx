import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { isAuthenticated } from '../services/auth'

export default function ProjectDetails(){
  const { id } = useParams()
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const navigate = useNavigate()

  async function load(){
    const res = await api.get(`/api/v1/projects/${id}/tasks`)
    setTasks(res.data)
  }

  useEffect(()=>{ if(!isAuthenticated()) { navigate('/login'); return } ; load() }, [id])

  async function add(e: React.FormEvent){
    e.preventDefault()
    if(!title) return
    await api.post(`/api/v1/projects/${id}/tasks`, { title, dueDate: due || null })
    setTitle(''); setDue('')
    load()
  }

  async function toggle(taskId: number){
    await api.patch(`/api/v1/projects/${id}/tasks/${taskId}/toggle`)
    load()
  }

  async function del(taskId: number){
    if(!confirm('Delete task?')) return
    await api.delete(`/api/v1/projects/${id}/tasks/${taskId}`)
    load()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <form onSubmit={add} className="mb-4 flex gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 flex-1" />
        <input value={due} onChange={e=>setDue(e.target.value)} type="date" className="border p-2" />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
      </form>

      <div className="space-y-2">
        {tasks.map(t => (
          <div key={t.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>
              <div className={"font-bold " + (t.isCompleted ? 'line-through' : '')}>{t.title}</div>
              <div className="text-sm text-gray-600">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''}</div>
            </div>
            <div>
              <button onClick={()=>toggle(t.id)} className="mr-2">{t.isCompleted ? 'Uncheck' : 'Done'}</button>
              <button onClick={()=>del(t.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
