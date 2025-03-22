export const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js"
export const DEFAULT_SCRIPT_ID = 'cf-turnstile-script'

// should find a way to append Next's Script component
export const injectTurnstileScript = () => {
  const script = document.createElement('script')

  script.id = DEFAULT_SCRIPT_ID
  script.src = TURNSTILE_URL

  if (document.querySelector(`script[src="${script.src}"]`)) {
    return
  }

  script.defer = true
  script.async = true


  document.body.appendChild(script)
}

export const isTurnstileExist = () => {
  return typeof window !== 'undefined' && window.turnstile !== 'undefined'
}