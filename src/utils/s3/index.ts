import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3' // ES Modules import

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
  region: process.env.AWS_REGION ?? '',
})

export const getObject = (bucket: string, key: string) => {
  return new Promise<string>(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key })

    try {
      const response = await s3Client.send(getObjectCommand)

      if (response.Body) {
        const bodyStream = response.Body
        const bodyAsString = await bodyStream.transformToString()
        resolve(bodyAsString)
      }
    } catch (error) {
      return reject(error)
    }
  })
}

export const listObjects = (bucket: string, key: string) => {
  return new Promise<string[]>(async (resolve, reject) => {
    const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucket, Prefix: key })

    try {
      const response = await s3Client.send(listObjectsCommand)
      console.log(response)
      const names: string[] = []

      if (response.KeyCount && response.KeyCount > 0) {
        response.Contents?.forEach((obj) => {
          if (obj && obj.Key) names.push(obj.Key)
        })
      }

      resolve(names)
    } catch (error) {
      return reject(error)
    }
  })
}
