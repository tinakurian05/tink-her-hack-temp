import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import BreathingGame from './BreathingGame'
import GratitudeGarden from './GratitudeGarden'

const PhaseOneSession = ({ session }) => {
  const [moodBefore, setMoodBefore] = useState(3)
  const [moodAfter, setMoodAfter] = useState(3)
  const [moodBeforeTouched, setMoodBeforeTouched] = useState(false)
  const [moodAfterTouched, setMoodAfterTouched] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [completedToday, setCompletedToday] = useState(false)
  const [sessions, setSessions] = useState([])

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const fetchSessions = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('sessions')
      .select('id, created_at')
      .eq('user_id', session.user.id)
      .eq('phase', 'Phase 1')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setSessions(data ?? [])
    setCompletedToday((data ?? []).some((item) => item.created_at === today))
  }, [session.user.id, today])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleComplete = async () => {
    setSaving(true)
    setError('')

    const { data: existing, error: checkError } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('phase', 'Phase 1')
      .eq('created_at', today)
      .limit(1)

    if (checkError) {
      setError(checkError.message)
      setSaving(false)
      return
    }

    if (existing && existing.length > 0) {
      setCompletedToday(true)
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase.from('sessions').insert({
      user_id: session.user.id,
      phase: 'Phase 1',
      mood_before: moodBefore,
      mood_after: moodAfter,
      completed: true,
      created_at: today,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setCompletedToday(true)
    await fetchSessions()
    setSaving(false)
  }

  return (
    <div className="phase-content">
      <div className="session-card">
        <div className="session-header">
          <h3>Breathing Pulse</h3>
          <span className="session-duration">3–5 minutes</span>
        </div>

        {completedToday ? (
          <div className="alert alert-stable">
            You’ve completed today’s session 🌿
          </div>
        ) : (
          <>
            <label className="field">
              Mood before session (1–5)
              <input
                type="range"
                min="1"
                max="5"
                value={moodBefore}
                onChange={(event) => {
                  setMoodBefore(Number(event.target.value))
                  setMoodBeforeTouched(true)
                }}
              />
            </label>

            <BreathingGame
              disabled={completedToday}
              canStart={moodBeforeTouched}
              onComplete={() => setTimerDone(true)}
            />

            <label className="field">
              Mood after session (1–5)
              <input
                type="range"
                min="1"
                max="5"
                value={moodAfter}
                onChange={(event) => {
                  setMoodAfter(Number(event.target.value))
                  setMoodAfterTouched(true)
                }}
              />
            </label>

            {error && <div className="error-banner">{error}</div>}

            <button
              className="primary-btn"
              type="button"
              disabled={!timerDone || !moodAfterTouched || saving}
              onClick={handleComplete}
            >
              {saving ? 'Saving…' : 'Mark Session Complete'}
            </button>
          </>
        )}

        {completedToday && (
          <p className="consistency">Consistency builds recovery 🌿</p>
        )}
      </div>

      <GratitudeGarden sessions={sessions} />
    </div>
  )
}

export default PhaseOneSession
