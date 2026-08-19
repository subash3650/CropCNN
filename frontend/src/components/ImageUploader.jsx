import { useRef, useState } from 'react'

const ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png'

export default function ImageUploader({ onFileSelect, disabled }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handlePick() {
    if (disabled) return
    inputRef.current?.click()
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
    event.target.value = ''
  }

  function handleDragOver(event) {
    if (disabled) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event) {
    if (disabled) return
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="uploader">
      <button
        type="button"
        className={`dropzone${isDragging ? ' dropzone--dragging' : ''}`}
        onClick={handlePick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        aria-label="Upload a crop image. JPG, JPEG, or PNG."
      >
        <svg
          className="dropzone-icon"
          viewBox="0 0 24 24"
          width="40"
          height="40"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          />
        </svg>
        <span className="dropzone-title">Upload or drop an image</span>
        <span className="dropzone-hint">JPG / JPEG / PNG</span>
      </button>

      <input
        ref={inputRef}
        className="file-input"
        type="file"
        accept={ACCEPT}
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Choose a crop image file"
      />
    </div>
  )
}
