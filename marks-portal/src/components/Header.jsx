import './Header.css'

export default function Header({ user, studentData, onLogout }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill="var(--accent)" />
            <text x="22" y="30" textAnchor="middle" fill="white"
              fontFamily="DM Serif Display, serif" fontSize="22">M</text>
          </svg>
          <span className="header-brand-name">Marks Portal</span>
        </div>
        <div className="header-student">
          <p className="header-student-name">{studentData.name}</p>
          <p className="header-student-meta">
            <span>{studentData.rollNo}</span>
            <span className="header-dot">·</span>
            <span>{user.email}</span>
          </p>
        </div>
        <button className="btn-logout" onClick={onLogout} type="button">
          Sign out
        </button>
      </div>
    </header>
  )
}