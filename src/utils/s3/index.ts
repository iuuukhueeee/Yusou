import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3" // ES Modules import

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
})

export const getObject = (bucket: string, key: string) => {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key })

    try {
      const response = await s3Client.send(getObjectCommand)
      const responseDataChunks = []

      if (response.Body) {
        response.Body.once("error", (err) => reject(err))

        response.Body.on("data", (chunk) => responseDataChunks.push(chunk))

        response.Body.once("end", () => resolve(responseDataChunks.join("")))
      }
    } catch (error) {
      return reject(error)
    }
  })
}
