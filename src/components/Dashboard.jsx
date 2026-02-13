import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import HealthForm from './HealthForm'
import PhaseSession from './PhaseSession'

const calculateRecoveryScore = ({
  moodScore,
  sleepHours,
  bleedingLevel,
  painScore,
  ironIntake,
  supportLevel,
}) => {
  const moodPoints = (moodScore / 5) * 40
  const sleepPoints = (Math.min(Math.max(sleepHours, 0), 10) / 10) * 15
  const bleedingPoints = ((3 - bleedingLevel) / 2) * 15
  const painPoints = ((10 - painScore) / 9) * 20
  const supportPoints = (supportLevel / 3) * 10
  const ironBonus = ironIntake ? 5 : 0

  const total = moodPoints + sleepPoints + bleedingPoints + painPoints + supportPoints + ironBonus
  return Math.min(100, Math.max(0, Math.round(total)))
}

const classifyRisk = (score) => {
  if (score <= 40) return 'High Risk'
  if (score <= 70) return 'Moderate Risk'
  return 'Stable'
}

const Dashboard = ({ session }) => {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [latestScore, setLatestScore] = useState(null)
  const [latestRisk, setLatestRisk] = useState('')

  const fetchRecords = async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('daily_records')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (fetchError) {
      setError(fetchError.message)
      setRecords([])
      setLoading(false)
      return
    }

    const ordered = [...(data ?? [])].reverse()
    setRecords(ordered)

    if (ordered.length > 0) {
      const latest = ordered[ordered.length - 1]
      setLatestScore(latest.recovery_score)
      setLatestRisk(latest.risk_level)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (values) => {
    setSaving(true)
    setError('')

    const recoveryScore = calculateRecoveryScore(values)
    const riskLevel = classifyRisk(recoveryScore)

    const { error: insertError } = await supabase.from('daily_records').insert({
      user_id: session.user.id,
      mood_score: values.moodScore,
      sleep_hours: values.sleepHours,
      bleeding_level: values.bleedingLevel,
      pain_score: values.painScore,
      iron_intake: values.ironIntake,
      support_level: values.supportLevel,
      recovery_score: recoveryScore,
      risk_level: riskLevel,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setLatestScore(recoveryScore)
    setLatestRisk(riskLevel)
    await fetchRecords()
    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const riskClass = useMemo(() => {
    if (!latestRisk) return ''
    return latestRisk === 'Stable'
      ? 'risk-stable'
      : latestRisk === 'Moderate Risk'
        ? 'risk-moderate'
        : 'risk-high'
  }, [latestRisk])

  const deliveryDetails = useMemo(() => {
    const metadata = session?.user?.user_metadata ?? {}
    return {
      fullName: metadata.full_name || '—',
      deliveryDate: metadata.delivery_date || '—',
      deliveryType: metadata.delivery_type || '—',
      deliveryLocation: metadata.delivery_location || '—',
      deliveryNotes: metadata.delivery_notes || '—',
    }
  }, [session])

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1>Postpartum Recovery Risk Analyzer</h1>
          <p className="muted">Track daily signals and spot risk early.</p>
        </div>
        <button className="secondary-btn" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      <section className="summary">
        <div className="summary-card">
          <div className="summary-label">Latest Recovery Score</div>
          <div className="summary-score">
            {latestScore !== null ? latestScore : '--'}
          </div>
          {latestRisk && (
            <span className={`risk-badge ${riskClass}`}>{latestRisk}</span>
          )}
        </div>
        <div className="summary-card">
          <div className="summary-label">Delivery Details</div>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{deliveryDetails.fullName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date</span>
              <span className="detail-value">{deliveryDetails.deliveryDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type</span>
              <span className="detail-value">{deliveryDetails.deliveryType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hospital</span>
              <span className="detail-value">{deliveryDetails.deliveryLocation}</span>
            </div>
            <div className="detail-item detail-notes">
              <span className="detail-label">Notes</span>
              <span className="detail-value">{deliveryDetails.deliveryNotes}</span>
            </div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Postpartum Journal</div>
          <p className="muted">Share thoughts, photos, or notes from your recovery journey.</p>
          <button className="primary-btn" onClick={() => navigate('/journal')}>
            Open Journal
          </button>
        </div>
        {latestRisk === 'High Risk' && (
          <div className="alert">
            <strong>⚠️ High risk detected.</strong> Consider contacting your care team.
            <button
              className="alert-link"
              onClick={() => navigate('/specialists')}
            >
              Consult Specialist →
            </button>
          </div>
        )}
        {latestRisk === 'Moderate Risk' && (
          <div className="alert alert-moderate">
            <strong>ℹ️ Moderate risk level.</strong> Talk to a nutritionist for guidance.
            <button
              className="alert-link"
              onClick={() => navigate('/specialists')}
            >
              Find Nutritionist →
            </button>
          </div>
        )}
        {latestRisk === 'Stable' && (
          <div className="alert alert-stable">
            <strong>✅ Stable recovery!</strong> Keep following these tips for best results.
            <button
              className="alert-link"
              onClick={() => navigate('/tips')}
            >
              View Tips →
            </button>
          </div>
        )}
      </section>

      <div className="dashboard-grid">
        <PhaseSession session={session} />
        <HealthForm onSubmit={handleSubmit} loading={saving} />
      </div>

      {error && <div className="error-banner">{error}</div>}
    </div>
  )
}

export default Dashboard
