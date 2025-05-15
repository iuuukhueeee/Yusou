'use server'

import * as crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ data: crypto.randomUUID() })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
