const GratitudeGarden = ({ sessions }) => {
  return (
    <div className="card gratitude-card">
      <div className="gratitude-header">
        <h3>Your Gratitude Garden</h3>
        <span className="gratitude-count">Total Sessions Completed: {sessions.length}</span>
      </div>
      <div className="gratitude-grid">
        {sessions.map((session) => (
          <span key={session.id} className="gratitude-flower" role="img" aria-label="flower">
            🌼
          </span>
        ))}
      </div>
    </div>
  )
}

export default GratitudeGarden
