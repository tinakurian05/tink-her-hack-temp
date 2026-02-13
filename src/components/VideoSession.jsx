import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'

const VideoSession = ({ session, phase, title, duration, videoUrl }) => {
  const [started, setStarted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [completedToday, setCompletedToday] = useState(false)

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const checkCompletion = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('phase', phase)
      .eq('created_at', today)
      .limit(1)

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setCompletedToday((data ?? []).length > 0)
  }, [phase, session.user.id, today])

  useEffect(() => {
    checkCompletion()
  }, [checkCompletion])

  const handleComplete = async () => {
    setSaving(true)
    setError('')

    const { data: existing, error: checkError } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('phase', phase)
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
      phase,
      mood_before: null,
      mood_after: null,
      completed: true,
      created_at: today,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setCompletedToday(true)
    setSaving(false)
  }

  return (
    <div className="session-card">
      <div className="session-header">
        <div>
          <h3>{title}</h3>
          <p className="muted">{duration}</p>
        </div>
      </div>

      {completedToday ? (
        <div className="alert alert-stable">Today’s session completed 🌿</div>
      ) : (
        <>
          <div className="video-wrapper">
            <iframe
              src={videoUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="video-actions">
            <button
              className="secondary-btn"
              type="button"
              onClick={() => setStarted(true)}
              disabled={started}
            >
              {started ? 'Session Started' : 'Start Session'}
            </button>
            <button
              className="primary-btn"
              type="button"
              onClick={handleComplete}
              disabled={!started || saving}
            >
              {saving ? 'Saving…' : 'Mark as Completed'}
            </button>
          </div>
        </>
      )}

      {error && <div className="error-banner">{error}</div>}
      {completedToday && <p className="consistency">Consistency builds recovery 🌿</p>}
    </div>
  )
}

export default VideoSession
