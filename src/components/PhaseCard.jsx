const PhaseCard = ({ 
  phaseNumber, 
  title, 
  description, 
  duration, 
  children,
  actionLabel = 'Start Session',
  onAction = null
}) => {
  const borderColor = {
    1: '#DCEEFF',
    2: '#E8F5E9',
    3: '#FFF8E1'
  }[phaseNumber] || '#DCEEFF'

  const bgColor = {
    1: '#F0F7FF',
    2: '#F1F8F4',
    3: '#FFFBF0'
  }[phaseNumber] || '#F0F7FF'

  return (
    <div 
      className="phase-card-premium" 
      style={{ 
        borderLeftColor: borderColor,
        backgroundColor: bgColor
      }}
    >
      <div className="phase-card-header">
        <div className="phase-badge">
          Phase {phaseNumber}
        </div>
        <h2 className="phase-card-title">{title}</h2>
        <p className="phase-card-duration">
          <span className="duration-icon">⏱</span> {duration}
        </p>
      </div>
      
      <p className="phase-card-description">
        {description}
      </p>

      <div className="phase-card-content">
        {children}
      </div>
    </div>
  )
}

export default PhaseCard
