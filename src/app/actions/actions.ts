'use server'

import { listObjects } from '@/utils/s3'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function getData(code: string) {
  try {
    if (code == null) throw Error('Code is missing')

    const supabase = await createClient()

    const { data } = await supabase
      .from('shares')
      .select('*')
      .eq('otp_code', String(code))
      .maybeSingle()

    if (data && data.object_key) {
      // const response = await getObject(process.env.S3_BUCKET ?? "", data.object_key)
      const response = await listObjects(process.env.S3_BUCKET ?? '', data.object_key)
      return response
    }

    throw Error('Missing object key')
  } catch (error) {
    throw error
  }
}

export async function verifySite(token: string) {
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
