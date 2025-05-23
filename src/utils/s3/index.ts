import { ResponseLink } from '@/types';
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'; // ES Modules import
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
  region: process.env.AWS_REGION ?? '',
})

// export const getObject = (bucket: string, key: string) => {
//   return new Promise<string>(async (resolve, reject) => {
//     const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key })

//     try {
//       const response = await s3Client.send(getObjectCommand)

//       if (response.Body) {
//         const bodyStream = response.Body
//         const bodyAsString = await bodyStream.transformToString()
//         resolve(bodyAsString)
//       }
//     } catch (error) {
//       return reject(error)
//     }
//   })
// }

export const listObjects = (bucket: string, key: string) => {
  return new Promise<ResponseLink[]>(async (resolve, reject) => {
    const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucket, Prefix: key })

    try {
      const response = await s3Client.send(listObjectsCommand)
      const names: ResponseLink[] = []

      if (response.KeyCount && response.KeyCount > 0) {
        response.Contents?.forEach((obj) => {
          if (obj && obj.Key) names.push({ objectKey: obj.Key, presignedLink: '' })
        })
      }

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < names.length; i++) {
        const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: names[i].objectKey })
        names[i].presignedLink = await generatePresignedUrl(s3Client, getObjectCommand)
        names[i].objectKey = names[i].objectKey.split('/')[1]
      }

      resolve(names)
    } catch (error) {
      return reject(error)
    }
  })
}

// https://repost.aws/questions/QUrftN6RSZQ9GYT9O5koKXzg/s3-how-do-we-protect-ourselves-from-a-malicious-user-refreshing-a-page-a-million-times-in-order-to-rack-up-an-aws-s3-bill
async function generatePresignedUrl(client: S3Client, command: GetObjectCommand | PutObjectCommand): Promise<string> {
  try {
    return await getSignedUrl(client, command, { expiresIn: 600 })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const generatePutPresignedUrl = (bucket: string, key: string) => {
  return new Promise<string>(async (resolve, reject) => {
    const putObjectCommand = new PutObjectCommand({ Bucket: bucket, Key: key })
    try {
      const response = await generatePresignedUrl(s3Client, putObjectCommand)
      resolve(response)

    } catch (error) {
      return reject(error)
    }

  })
}