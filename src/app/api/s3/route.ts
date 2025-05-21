'use server'

import { generatePutPresignedUrl } from '@/utils/s3'
import { NextRequest, NextResponse } from 'next/server'

// export async function PUT(request: NextRequest) {
//   try {
//     const form = await request.formData()

//     const data = form.get('data')
//     const objectKey = form.get('objectKey')

//     // files
//     if (data && data instanceof File) {
//       // Body accepts Uint8Array<ArrayBufferLike>
//       const input = {
//         Body: await new Blob([data], {
//           type: data.type,
//         }).bytes(),
//         Bucket: process.env.S3_BUCKET,
//         Key: `${objectKey}/${data.name}`,
//       }

//       const command = new PutObjectCommand(input)

//       await s3Client.send(command)
//     }

//     // messages
//     if (data && typeof data === 'string') {
//       const input = {
//         Body: data,
//         Bucket: process.env.S3_BUCKET,
//         'Content-Type': 'plain/text',
//         Key: `${objectKey}/text.txt`,
//       }

//       const command = new PutObjectCommand(input)
//       await s3Client.send(command)
//     }

//     return NextResponse.json({ data: 'ok' })
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: error }, { status: 500 })
//   }
// }

export async function GET(req: NextRequest) {

  const searchParams = req.nextUrl.searchParams
  const key = searchParams.get('key')
  try {
    if (key) {
      const response = await generatePutPresignedUrl(process.env.S3_BUCKET ?? '', key)
      return NextResponse.json({ data: response })
    }
    return NextResponse.json({ data: 'empty' })

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}