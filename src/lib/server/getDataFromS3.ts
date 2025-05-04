'use server'

import checkCfTurnstileToken from "@/lib/server/checkCfTurnstileToken"
import { ResponseLink } from "@/types"
import { verify_hash } from "@/utils/core"
import { listObjects } from "@/utils/s3"
import { createClient } from '@/utils/supabase/server'

export default async function getDataFromS3(code: string, turnstileRes: string, password: string) {
  try {
    if (!code || !turnstileRes) throw Error('Code is missing')

    const outcome = await checkCfTurnstileToken(turnstileRes)

    console.log(outcome)
    if (outcome.success) {
      const supabase = await createClient()

      const { data } = await supabase
        .from('shares')
        .select('*')
        .eq('otp_code', String(code))
        .maybeSingle()

      if (data && data.object_key) {
        if (data.password) {
          const isPasswordMatch = await verify_hash(password, data.password)
          if (!isPasswordMatch) return []
        }
        const response = await listObjects(process.env.S3_BUCKET ?? '', data.object_key)
        return response

      }
    }

    if (!outcome.success) {
      const names: ResponseLink[] = []
      names.push({
        objectKey: '',
        presignedLink: '',
        additionalInfo: { message: 'Captcha challenges does not pass', status: 400 },
      })
      return names
    }

    throw Error('Not found associated otp code or object key')
  } catch (error) {
    throw error
  }
} 