import PhaseOneSession from './PhaseOneSession'
import VideoSession from './VideoSession'

const PhaseSession = ({ session }) => {
  const metadata = session?.user?.user_metadata ?? {}
  const weeksPostpartum = Number(metadata.weeks_postpartum ?? 0)

  let phase = 'Phase 1'
  let title = 'Phase 1 – Emotional Stabilization'
  let description = 'Short breathing and gratitude practices to steady your mood.'
  let duration = '3–5 minutes'

  if (weeksPostpartum > 8 && weeksPostpartum <= 17) {
    phase = 'Phase 2'
    title = 'Phase 2 – Mind-Body Reconnection'
    description = 'Gentle meditation and light yoga to restore balance.'
    duration = '10–15 minutes'
  } else if (weeksPostpartum > 17) {
    phase = 'Phase 3'
    title = 'Phase 3 – Gentle Strength & Stretch'
    description = 'Soft stretching and activation to rebuild strength.'
    duration = '10–15 minutes'
  }

  const themeClass =
    phase === 'Phase 1'
      ? 'phase-theme-1'
      : phase === 'Phase 2'
        ? 'phase-theme-2'
        : 'phase-theme-3'

  return (
    <div className={`card phase-card ${themeClass}`}>
      <div className="phase-header">
        <div>
          <p className="phase-label">Active Phase</p>
          <h2>{title}</h2>
          <p className="muted">{description}</p>
        </div>
        <div className="phase-meta">
          <span className="phase-pill">{phase}</span>
          <span className="phase-duration">{duration}</span>
        </div>
      </div>

      {phase === 'Phase 1' ? (
        <PhaseOneSession session={session} />
      ) : (
        <VideoSession
          session={session}
          phase={phase}
          title={title}
          duration={duration}
          videoUrl={
            phase === 'Phase 2'
              ? 'https://www.youtube.com/embed/6p_yaNFSYao'
              : 'https://www.youtube.com/embed/2L2lnxIcNmo'
          }
        />
      )}
    </div>
  )
}

export default PhaseSession
