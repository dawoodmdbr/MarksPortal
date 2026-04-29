import '../styles/MarksTable.css'

export default function MarksTable({ title, marks, maxMarks, totalAbs }) {
  const entries = Object.entries(marks)

  // Calculate section totals
  const earned = entries.reduce((sum, [, v]) => sum + (v ?? 0), 0)
  const total  = entries.reduce((sum, [k]) => sum + (maxMarks?.[k] ?? 0), 0)

  return (
    <section className="marks-section">
      <div className="marks-section-header">
        <h2 className="marks-section-title">{title}</h2>
        <span className="marks-section-total">
          ABS: <strong>{(earned/total)*totalAbs}</strong> / ${totalAbs}
        </span>
      </div>

      <div className="marks-grid">
        {entries.map(([label, value]) => (
          <div className="mark-card" key={label}>
            <span className="mark-label">{label}</span>
            <div className="mark-score">
              <span className="mark-earned">{value ?? '—'}</span>
              {maxMarks?.[label] != null && (
                <span className="mark-max">/ {maxMarks[label]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}