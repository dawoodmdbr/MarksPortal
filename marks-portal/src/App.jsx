import { useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [studentData, setStudentData] = useState(null)

  function handleLoginSuccess(userData, marks) {
    setUser(userData)
    setStudentData(marks)
  }

  function handleLogout() {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    setUser(null)
    setStudentData(null)
  }

  if (user && studentData) {
    return (
      <Dashboard
        user={user}
        studentData={studentData}
        onLogout={handleLogout}
      />
    )
  }

  return <Login onLoginSuccess={handleLoginSuccess} />
}