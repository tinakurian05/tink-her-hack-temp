import { useEffect, useMemo, useState } from 'react'

const TOTAL_SECONDS = 180

const BreathingGame = ({ onComplete, disabled, canStart }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)
  const [breathText, setBreathText] = useState('Inhale')

  useEffect(() => {
    if (!isRunning) return undefined

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRunning(false)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, onComplete])

  useEffect(() => {
    if (!isRunning) return undefined

    const phaseTimer = setInterval(() => {
      setBreathText((prev) => (prev === 'Inhale' ? 'Exhale' : 'Inhale'))
    }, 4000)

    return () => clearInterval(phaseTimer)
  }, [isRunning])

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
    const seconds = String(remaining % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [remaining])

  const handleStart = () => {
    if (disabled || !canStart) return
    setRemaining(TOTAL_SECONDS)
    setBreathText('Inhale')
    setIsRunning(true)
  }

  return (
    <div className="breathing-game">
      <div className={`breathing-circle ${isRunning ? 'breathing-active' : ''}`}>
        <span className="breathing-text">{breathText}</span>
      </div>
      <div className="breathing-meta">
        <div className="timer">{formattedTime}</div>
        <button
          className="primary-btn"
          type="button"
          disabled={disabled || !canStart || isRunning}
          onClick={handleStart}
        >
          {isRunning ? 'Session in progress…' : 'Start Breathing Session'}
        </button>
      </div>
    </div>
  )
}

export default BreathingGame
