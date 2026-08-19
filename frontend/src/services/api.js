const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const MAX_FILE_SIZE = 10 * 1024 * 1024

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
export const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png']

export const ENDPOINTS = {
  predict: `${API_URL}/predict`,
  health: `${API_URL}/health`,
}

export function getApiUrl() {
  return API_URL
}

export async function checkHealth() {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(ENDPOINTS.health, { signal: controller.signal })
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`)
    }
    return await res.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function predictImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  let res
  try {
    res = await fetch(ENDPOINTS.predict, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Unable to connect to the prediction server. Please make sure the backend is running.')
  }

  if (!res.ok) {
    let detail = 'The prediction could not be completed. Please try again.'
    try {
      const data = await res.json()
      if (data && typeof data.detail === 'string' && data.detail.trim()) {
        detail = data.detail
      }
    } catch {
      // ignore malformed error bodies
    }
    throw new Error(detail)
  }

  const data = await res.json()

  if (
    !data ||
    typeof data.crop !== 'string' ||
    typeof data.confidence_percent !== 'number'
  ) {
    throw new Error('The prediction server returned an unexpected response.')
  }

  return data
}
