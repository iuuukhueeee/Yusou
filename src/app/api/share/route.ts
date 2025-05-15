'use server'

import { generate_hash, generate_otp } from '@/utils/core'
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { objectKey, password } = await request.json()

    const supabase = await createClient()
    const { error, data } = await supabase
      .from('shares')
      .insert({
        otp_code: generate_otp(),
        active: true,
        object_key: objectKey,
        password: password ? generate_hash(password) : null,
      })
      .select()

    console.log(data)

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: error })
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const code = searchParams.get('code')
//     if (code == null) throw Error('Code is missing')

//     const supabase = await createClient()
//     const data = supabase.from('shares').select().eq('code', code)
//     return NextResponse.json({ data })

//   } catch (error) {
//     return NextResponse.json({ error: error });
//   }
// }
