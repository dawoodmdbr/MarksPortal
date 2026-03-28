// ⚠️ Replace this with your actual Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdzao9oHyxY0RJNbBISzQCvCnvQ8VV0zIKW2xP0bzHYQnOsPv4HzouA8I7fdckTcRqOQ/exec'

export const ALLOWED_DOMAIN = '@cfd.nu.edu.pk'

export function isUniversityEmail(email) {
  return typeof email === 'string' && email.toLowerCase().endsWith(ALLOWED_DOMAIN)
}

export async function fetchStudentMarks(email) {
  const url = `${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}`

  let response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Network error. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new Error(`Server error (${response.status}). Try again later.`)
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Invalid response from server.')
  }

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}