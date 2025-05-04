'use server'

import { headers } from "next/headers"

export default async function checkCfTurnstileToken(token: string) {
  try {
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const forwardedFor = (await headers()).get('x-forwarded-for')

    const ip = forwardedFor ? forwardedFor.split(',')[0] : null
    const result = await fetch(url, {
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const outcome = await result.json()

    return outcome
  } catch (error) {
    throw error
  }
}