import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import BackendStatus from './components/BackendStatus'
import ImageUploader from './components/ImageUploader'
import ImagePreview from './components/ImagePreview'
import LoadingState from './components/LoadingState'
import PredictionResult from './components/PredictionResult'
import About from './components/About'
import { checkHealth, predictImage } from './services/api'
import { validateImage } from './utils/imageUtils'

export default function App() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const objectUrlRef = useRef(null)

  const healthCheckTriggered = useRef(false)

  useEffect(() => {
    if (healthCheckTriggered.current) return
    healthCheckTriggered.current = true

    let active = true
    checkHealth()
      .then(() => {
        if (active) setBackendStatus('online')
      })
      .catch(() => {
        if (active) setBackendStatus('offline')
      })

    const intervalId = setInterval(() => {
      checkHealth()
        .then(() => {
          if (active) setBackendStatus('online')
        })
        .catch(() => {
          if (active) setBackendStatus('offline')
        })
    }, 30000)

    return () => {
      active = false
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  function clearPreview() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setPreviewUrl(null)
  }

  const handleFileSelect = useCallback(
    (selectedFile) => {
      const validationError = validateImage(selectedFile)
      if (validationError) {
        clearPreview()
        setFile(null)
        setError(validationError)
        return
      }

      clearPreview()
      const url = URL.createObjectURL(selectedFile)
      objectUrlRef.current = url

      setFile(selectedFile)
      setPreviewUrl(url)
      setPrediction(null)
      setError(null)
    },
    [],
  )

  function handleRemoveImage() {
    clearPreview()
    setFile(null)
    setPrediction(null)
    setError(null)
  }

  function handleTryAnother() {
    handleRemoveImage()
  }

  async function handlePredict() {
    if (!file || isLoading) return

    const validationError = validateImage(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const result = await predictImage(file)
      setPrediction(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Prediction failed. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const canPredict = !isLoading && file !== null

  return (
    <div className="app-shell">
      <BackendStatus status={backendStatus} />
      <Header />

      <main className="app-main">
        <p className="intro">
          Upload an image to identify the crop. No upload happens until you
          click “Classify Crop”.
        </p>

        <section className="card upload-card" aria-labelledby="upload-title">
          <h2 id="upload-title" className="sr-only">
            Upload an image
          </h2>

          {previewUrl && file ? (
            <ImagePreview
              src={previewUrl}
              filename={file.name}
              onRemove={handleRemoveImage}
              disabled={isLoading}
            />
          ) : (
            <ImageUploader onFileSelect={handleFileSelect} disabled={isLoading} />
          )}

          <div className="actions">
            <button
              type="button"
              className="primary-button"
              onClick={handlePredict}
              disabled={!canPredict}
            >
              {isLoading ? 'Analyzing…' : 'Classify Crop'}
            </button>

            {prediction && !isLoading && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleTryAnother}
              >
                Try another image
              </button>
            )}
          </div>

          {isLoading && <LoadingState />}

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {prediction && !isLoading && <PredictionResult result={prediction} />}
        </section>

        <About />
      </main>

      <footer className="app-footer">
        <p>
          Powered by a MobileNetV2 model served by a FastAPI backend.
        </p>
      </footer>
    </div>
  )
}
