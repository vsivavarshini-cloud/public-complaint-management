import { useEffect, useMemo, useState } from 'react'

const API = '/api'

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''

  const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

  if (!response.ok) {
    const message = data?.details
        ? Object.values(data.details).join(', ')
        : data?.message || data?.error || 'Request failed'

    throw new Error(message)
  }

  return data
}

function formatDate(value) {
  if (!value) return '-'

  return new Date(value).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function statusText(status) {
  return status.replace('_', ' ')
}

function statusClass(status) {
  return status.toLowerCase().replace('_', '-')
}

function StatusBadge({ status }) {
  return (
      <span className={`status-badge status-${statusClass(status)}`}>
      {statusText(status)}
    </span>
  )
}

function StatCard({ label, value, note, theme, symbol }) {
  return (
      <div className={`stat-card ${theme}`}>
        <div className="stat-card-top">
          <span className="stat-symbol">{symbol}</span>
          <span className="stat-label">{label}</span>
        </div>

        <div className="stat-value">{value}</div>

        <div className="stat-note">{note}</div>
      </div>
  )
}

export default function App() {
  const [complaints, setComplaints] = useState([])
  const [citizens, setCitizens] = useState([])
  const [categories, setCategories] = useState([])
  const [officers, setOfficers] = useState([])
  const [aboveAverage, setAboveAverage] = useState([])
  const [officerCounts, setOfficerCounts] = useState({})

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const [history, setHistory] = useState(null)

  const [form, setForm] = useState({
    citizenId: '',
    categoryId: '',
    officerId: '',
    description: '',
  })

  const total = complaints.length

  const openCount = complaints.filter(
      (item) => item.status === 'OPEN'
  ).length

  const progressCount = complaints.filter(
      (item) => item.status === 'IN_PROGRESS'
  ).length

  const resolvedCount = complaints.filter(
      (item) => item.status === 'RESOLVED'
  ).length

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return complaints

    return complaints.filter((complaint) =>
        [
          complaint.complaintId,
          complaint.citizenName,
          complaint.categoryName,
          complaint.officerName,
          complaint.description,
          complaint.status,
        ]
            .join(' ')
            .toLowerCase()
            .includes(term)
    )
  }, [complaints, search])

  const maxCategoryCount = Math.max(
      1,
      ...aboveAverage.map((item) => item.complaintCount)
  )

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadReferenceData() {
    const [
      citizenRows,
      categoryRows,
      officerRows,
    ] = await Promise.all([
      api('/citizens'),
      api('/categories'),
      api('/officers'),
    ])

    setCitizens(citizenRows)
    setCategories(categoryRows)
    setOfficers(officerRows)

    const results = await Promise.all(
        officerRows.map(async (officer) => {
          const data = await api(
              `/officers/${officer.id}/open-count`
          )

          return [
            officer.id,
            data.openComplaints,
          ]
        })
    )

    setOfficerCounts(Object.fromEntries(results))
  }

  async function loadDashboard({ silent = false } = {}) {
    try {
      setError('')

      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [
        complaintRows,
        categoryRows,
      ] = await Promise.all([
        api('/complaints'),
        api('/categories/above-average'),
      ])

      setComplaints(complaintRows)
      setAboveAverage(categoryRows)

      await loadReferenceData()

      if (silent) {
        showToast('Dashboard refreshed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()

    setFormMessage('')
    setError('')

    const payload = {
      citizenId: Number(form.citizenId),
      categoryId: Number(form.categoryId),
      officerId: form.officerId
          ? Number(form.officerId)
          : null,
      description: form.description.trim(),
    }

    try {
      const created = await api('/complaints', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setForm({
        citizenId: '',
        categoryId: '',
        officerId: '',
        description: '',
      })

      setFormMessage(
          `Complaint #${created.complaintId} registered successfully.`
      )

      showToast(
          `Complaint #${created.complaintId} registered`
      )

      await loadDashboard({ silent: true })
    } catch (err) {
      setFormMessage(err.message)
    }
  }

  async function handleStatusChange(complaintId, status) {
    try {
      await api(`/complaints/${complaintId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })

      showToast(`Complaint #${complaintId} updated`)

      await loadDashboard({ silent: true })
    } catch (err) {
      showToast(err.message)
    }
  }

  async function showHistory(complaintId) {
    try {
      const rows = await api(
          `/complaints/${complaintId}/history`
      )

      setHistory({
        complaintId,
        rows,
      })
    } catch (err) {
      showToast(err.message)
    }
  }

  function showToast(message) {
    setToast(message)

    window.clearTimeout(window.__complaintToast)

    window.__complaintToast = window.setTimeout(() => {
      setToast('')
    }, 2800)
  }

  if (loading) {
    return (
        <div className="loading-screen">
          <div className="loading-card">
            <div className="loading-logo">PC</div>
            <div className="spinner" />
            <h2>Loading dashboard</h2>
            <p>Connecting to the complaint service...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="app-shell">
        <div className="top-strip" />

        <header className="header">
          <div className="header-inner">

            <div className="brand-group">
              <div className="brand-logo">
                PC
              </div>

              <div className="brand-copy">
                <div className="eyebrow">
                  PUBLIC SERVICE PORTAL
                </div>

                <h1>
                  Public Complaint Management
                </h1>

                <p>
                  Register, track and manage citizen complaints
                  in one place.
                </p>
              </div>
            </div>

            <div className="header-actions">
            <span className="connection-pill">
              <span className="connection-dot" />
              API Connected
            </span>

              <button
                  className="refresh-btn"
                  onClick={() => loadDashboard({ silent: true })}
                  disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

          </div>
        </header>

        <main className="container">

          {error && (
              <div className="error-banner">
                <strong>Connection error:</strong> {error}
              </div>
          )}

          <section className="stats-grid">

            <StatCard
                label="Total Complaints"
                value={total}
                note="All registered complaints"
                theme="theme-plum"
                symbol="01"
            />

            <StatCard
                label="Open"
                value={openCount}
                note="Waiting for action"
                theme="theme-coral"
                symbol="02"
            />

            <StatCard
                label="In Progress"
                value={progressCount}
                note="Currently being handled"
                theme="theme-gold"
                symbol="03"
            />

            <StatCard
                label="Resolved"
                value={resolvedCount}
                note="Successfully completed"
                theme="theme-sage"
                symbol="04"
            />

          </section>

          <section className="main-grid">

            <div className="panel form-panel">

              <div className="panel-title-row">
                <div>
                  <div className="section-kicker">
                    REGISTER
                  </div>

                  <h2>New Complaint</h2>

                  <p>
                    Submit a complaint through the REST API.
                  </p>
                </div>

                <div className="title-chip">
                  POST
                </div>
              </div>

              <form
                  className="complaint-form"
                  onSubmit={handleRegister}
              >

                <div className="form-row">

                  <label>
                    <span>Citizen</span>

                    <select
                        value={form.citizenId}
                        onChange={(event) =>
                            setForm({
                              ...form,
                              citizenId: event.target.value,
                            })
                        }
                        required
                    >
                      <option value="">
                        Select citizen
                      </option>

                      {citizens.map((citizen) => (
                          <option
                              key={citizen.id}
                              value={citizen.id}
                          >
                            {citizen.name}
                          </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Category</span>

                    <select
                        value={form.categoryId}
                        onChange={(event) =>
                            setForm({
                              ...form,
                              categoryId: event.target.value,
                            })
                        }
                        required
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map((category) => (
                          <option
                              key={category.id}
                              value={category.id}
                          >
                            {category.name}
                          </option>
                      ))}
                    </select>
                  </label>

                </div>

                <label>
                  <span>Officer</span>

                  <select
                      value={form.officerId}
                      onChange={(event) =>
                          setForm({
                            ...form,
                            officerId: event.target.value,
                          })
                      }
                  >
                    <option value="">
                      Not assigned
                    </option>

                    {officers.map((officer) => (
                        <option
                            key={officer.id}
                            value={officer.id}
                        >
                          {officer.name}
                        </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Description</span>

                  <textarea
                      rows="5"
                      maxLength="500"
                      placeholder="Describe the complaint..."
                      value={form.description}
                      onChange={(event) =>
                          setForm({
                            ...form,
                            description: event.target.value,
                          })
                      }
                      required
                  />
                </label>

                <div className="form-bottom">

                  <button
                      className="primary-btn"
                      type="submit"
                  >
                    Register Complaint
                  </button>

                  {formMessage && (
                      <span className="form-message">
                    {formMessage}
                  </span>
                  )}

                </div>

              </form>
            </div>

            <div className="insight-stack">

              <div className="panel insight-panel">

                <div className="panel-title-row">
                  <div>
                    <div className="section-kicker">
                      SUBQUERY
                    </div>

                    <h2>
                      Complaint Insights
                    </h2>
                  </div>

                  <div className="title-chip warm">
                    REPORT
                  </div>
                </div>

                <p className="panel-description">
                  Categories with complaints above
                  the average count.
                </p>

                <div className="bar-list">

                  {aboveAverage.length ? (
                      aboveAverage.map((item) => (
                          <div
                              className="bar-item"
                              key={item.categoryId}
                          >
                            <div className="bar-label-row">
                        <span>
                          {item.categoryName}
                        </span>

                              <strong>
                                {item.complaintCount}
                              </strong>
                            </div>

                            <div className="bar-track">
                              <div
                                  className="bar-fill"
                                  style={{
                                    width: `${
                                        (item.complaintCount /
                                            maxCategoryCount) *
                                        100
                                    }%`,
                                  }}
                              />
                            </div>
                          </div>
                      ))
                  ) : (
                      <div className="empty-inline">
                        No category is currently above
                        the average.
                      </div>
                  )}

                </div>

              </div>

              <div className="panel officer-panel">

                <div className="panel-title-row">
                  <div>
                    <div className="section-kicker">
                      FUNCTION
                    </div>

                    <h2>
                      Officer Workload
                    </h2>
                  </div>
                </div>

                <p className="panel-description">
                  Open complaint count returned
                  by the stored function.
                </p>

                <div className="officer-list">

                  {officers.map((officer) => (
                      <div
                          className="officer-row"
                          key={officer.id}
                      >
                        <div className="officer-avatar">
                          {officer.name
                              .split(' ')
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join('')}
                        </div>

                        <div className="officer-info">
                          <strong>
                            {officer.name}
                          </strong>

                          <span>
                        Officer #{officer.id}
                      </span>
                        </div>

                        <div className="officer-count">
                          {officerCounts[officer.id] ?? 0}
                          <small>open</small>
                        </div>
                      </div>
                  ))}

                </div>

              </div>

            </div>

          </section>

          <section className="panel complaints-panel">

            <div className="complaints-header">

              <div>
                <div className="section-kicker">
                  JOIN REPORT
                </div>

                <h2>Recent Complaints</h2>

                <p>
                  Complaint, citizen, category and officer
                  details combined through the database JOIN.
                </p>
              </div>

              <div className="search-box">
                <input
                    placeholder="Search complaints..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />
              </div>

            </div>

            <div className="table-wrap">

              <table>

                <thead>
                <tr>
                  <th>ID</th>
                  <th>Citizen</th>
                  <th>Category</th>
                  <th>Officer</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th />
                </tr>
                </thead>

                <tbody>

                {filteredComplaints.map((complaint) => (
                    <tr key={complaint.complaintId}>

                      <td>
                      <span className="complaint-id">
                        #{complaint.complaintId}
                      </span>
                      </td>

                      <td>
                        <strong>
                          {complaint.citizenName}
                        </strong>
                      </td>

                      <td>
                      <span className="category-pill">
                        {complaint.categoryName}
                      </span>
                      </td>

                      <td>
                        {complaint.officerName ? (
                            complaint.officerName
                        ) : (
                            <span className="unassigned">
                          Unassigned
                        </span>
                        )}
                      </td>

                      <td className="description-cell">
                        {complaint.description}
                      </td>

                      <td>

                        <div className="status-area">

                          <StatusBadge
                              status={complaint.status}
                          />

                          <select
                              className="status-select"
                              value={complaint.status}
                              onChange={(event) =>
                                  handleStatusChange(
                                      complaint.complaintId,
                                      event.target.value
                                  )
                              }
                          >
                            {STATUS_OPTIONS.map(
                                (status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                      {statusText(status)}
                                    </option>
                                )
                            )}
                          </select>

                        </div>

                      </td>

                      <td className="date-cell">
                        {formatDate(
                            complaint.createdAt
                        )}
                      </td>

                      <td>
                        <button
                            className="history-btn"
                            onClick={() =>
                                showHistory(
                                    complaint.complaintId
                                )
                            }
                        >
                          History
                        </button>
                      </td>

                    </tr>
                ))}

                </tbody>

              </table>

              {!filteredComplaints.length && (
                  <div className="empty-state">
                    No complaints match your search.
                  </div>
              )}

            </div>

          </section>

        </main>

        {history && (
            <div
                className="modal-overlay"
                onClick={() => setHistory(null)}
            >
              <div
                  className="modal-card"
                  onClick={(event) =>
                      event.stopPropagation()
                  }
              >

                <div className="modal-top">

                  <div>
                    <div className="section-kicker">
                      STATUS HISTORY
                    </div>

                    <h2>
                      Complaint #{history.complaintId}
                    </h2>
                  </div>

                  <button
                      className="close-btn"
                      onClick={() => setHistory(null)}
                  >
                    ×
                  </button>

                </div>

                <div className="history-list">

                  {history.rows.length ? (
                      history.rows.map((row) => (
                          <div
                              className="history-row"
                              key={row.historyId}
                          >
                            <div className="history-number">
                              {row.historyId}
                            </div>

                            <div className="history-content">
                              <div className="history-transition">
                        <span className="old-status">
                          {statusText(row.oldStatus)}
                        </span>

                                <span className="arrow">
                          →
                        </span>

                                <span className="new-status">
                          {statusText(row.newStatus)}
                        </span>
                              </div>

                              <small>
                                {formatDate(row.changedAt)}
                              </small>
                            </div>
                          </div>
                      ))
                  ) : (
                      <div className="empty-inline">
                        No status changes recorded yet.
                      </div>
                  )}

                </div>

              </div>
            </div>
        )}

        {toast && (
            <div className="toast">
              <span className="toast-dot" />
              {toast}
            </div>
        )}
      </div>
  )
}