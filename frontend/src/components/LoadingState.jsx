export default function LoadingState({ message = 'Analyzing image…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="loading-message">{message}</span>
    </div>
  )
}
