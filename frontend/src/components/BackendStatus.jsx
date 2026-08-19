const LABELS = {
  checking: 'Checking backend…',
  online: 'AI Server Online',
  offline: 'Backend Offline',
}

export default function BackendStatus({ status = 'checking' }) {
  return (
    <div
      className={`backend-status backend-status--${status}`}
      role="status"
      aria-live="polite"
      title={
        status === 'online'
          ? 'The prediction server is reachable'
          : status === 'offline'
            ? 'The prediction server is not reachable'
            : 'Checking the prediction server'
      }
    >
      <span className="status-dot" aria-hidden="true" />
      <span className="status-label">{LABELS[status]}</span>
    </div>
  )
}
