import './Header.css'

export default function Header({ user, studentData, onLogout }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
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