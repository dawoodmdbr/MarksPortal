import { useEffect, useRef, useState } from 'react'
import { isUniversityEmail, fetchStudentMarks } from '../services/api.js'
import './Login.css'

// ⚠️ Replace with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID = '72478546340-36346d41ib4g97qapb10cljgmipgpn7p.apps.googleusercontent.com'

export default function Login({ onLoginSuccess }) {
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const btnRef = useRef(null)

  useEffect(() => {
    function initGoogle() {
      if (!window.google?.accounts?.id) {
        setTimeout(initGoogle, 200)
        return
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 280,
      })
    }
    initGoogle()
  }, [])

  async function handleCredentialResponse(response) {
    setError('')
    setLoading(true)
    try {
      const payload = parseJwt(response.credential)
      const { email, name, picture } = payload

      if (!isUniversityEmail(email)) {
        setError('Access Denied: Only @cfd.nu.edu.pk email is allowed.')
        setLoading(false)
        return
      }

      const studentData = await fetchStudentMarks(email)
      onLoginSuccess({ email, name, picture }, studentData)
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-bg">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <main className="login-card">
        <div className="login-logo">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill="var(--accent)" />
            <text x="22" y="30" textAnchor="middle" fill="white"
              fontFamily="DM Serif Display, serif" fontSize="22">M</text>
          </svg>
        </div>
        <h1 className="login-title">Marks Portal</h1>
        <p className="login-subtitle">Sign in using your university email</p>
        <div className="login-divider" />
        <div className="google-btn-wrapper" ref={btnRef} />
        {loading && <p className="login-loading">Verifying your account…</p>}
        {error && (
          <div className="login-error" role="alert">
            <span>⚠ </span>{error}
          </div>
        )}
        <p className="login-note">
          Only <strong>@cfd.nu.edu.pk</strong> accounts are permitted.
        </p>
      </main>
    </div>
  )
}

function parseJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64).split('').map(c =>
      '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join('')
  )
  return JSON.parse(json)
}