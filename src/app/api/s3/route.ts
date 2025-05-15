'use server'

import { s3Client } from '@/utils/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const promises = []
    const form = await request.formData()

    const data = form.get('data')
    const objectKey = form.get('objectKey')

    // files
    if (data && data instanceof File) {
      // Body accepts Uint8Array<ArrayBufferLike>
      const input = {
        Body: await new Blob([data], {
          type: data.type,
        }).bytes(),
        Bucket: process.env.S3_BUCKET,
        Key: `${objectKey}/${data.name}`,
      }

      const command = new PutObjectCommand(input)

      const response = await s3Client.send(command)
      promises.push(response)
    }

    // messages
    if (data && typeof data === 'string') {
      const input = {
        Body: data,
        Bucket: process.env.S3_BUCKET,
        'Content-Type': 'plain/text',
        Key: `${objectKey}/text.txt`,
      }

      const command = new PutObjectCommand(input)
      const response = await s3Client.send(command)
      promises.push(response)
    }

    await Promise.all(promises)
    return NextResponse.json({ data: 'ok' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const objectKey = searchParams.get('objectKey')
//     if (objectKey) {
//       const response = await getObject(process.env.S3_BUCKET ?? '', objectKey)
//       return NextResponse.json({ response })
//     }
//   } catch (error) {
//     return NextResponse.json({ error: error }, { status: 500 })
//   }
// }
