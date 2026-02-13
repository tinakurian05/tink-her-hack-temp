import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const GraphSection = ({ records, loading, error }) => {
  const chartData = (records || []).map((record) => ({
    date: new Date(record.created_at).toLocaleDateString(),
    recoveryScore: record.recovery_score,
    moodScore: record.mood_score,
  }))

  return (
    <div className="card">
      <h2>Trends (Last 5 Days)</h2>
      {loading ? (
        <div className="muted">Loading charts…</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : chartData.length === 0 ? (
        <div className="muted">No data yet. Add your first record.</div>
      ) : (
        <div className="charts">
          <div className="chart-block">
            <div className="chart-title">Recovery Score</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="recoveryScore"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-block">
            <div className="chart-title">Mood Score</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default GraphSection
