import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
} from '../services/api'

export function validateImage(file) {
  if (!file) {
    return 'Please select an image first.'
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Please upload a JPG, JPEG, or PNG image.'
  }

  const extension = file.name.split('.').pop().toLowerCase()
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return 'Please upload a JPG, JPEG, or PNG image.'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image size must be less than 10 MB.'
  }

  return null
}
