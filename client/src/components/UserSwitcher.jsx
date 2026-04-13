import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function UserSwitcher({ activeUser, setActiveUser }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users').then(res => {
      setUsers(res.data)
      if (!activeUser && res.data.length > 0) setActiveUser(res.data[0])
    })         // loads all the available users from the backend 
  }, [])

  const initials = activeUser
    ? activeUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {initials}
      </div>
      <select
        value={activeUser?.id || ''}
        onChange={e => {
          const selected = users.find(u => u.id === parseInt(e.target.value))
          setActiveUser(selected)
        }}
        className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
      >
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
    </div>
  )
}
