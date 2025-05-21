'use server'

import { UUIDResponse } from '@/app/api/uuid/types'
import * as crypto from 'crypto'
import { NextResponse } from 'next/server'


export async function GET() {
  try {
    return NextResponse.json<UUIDResponse>({ data: crypto.randomUUID() })
  } catch (error) {
    return NextResponse.json<UUIDResponse>({ error: error, data: '' }, { status: 500 })
  }
}
