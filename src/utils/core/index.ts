import { IMAGE_MIME_TYPE } from '@mantine/dropzone'
import crypto from 'crypto'

export const generate_otp = () => {
  return crypto.randomInt(100000, 999999).toString()
}

type ValidImageMimeType = (typeof IMAGE_MIME_TYPE)[number]

export const isValidImageMimeType = (type: string): type is ValidImageMimeType => {
  // This cast is necessary because TypeScript's includes() doesn't narrow types automatically
  return (IMAGE_MIME_TYPE as readonly string[]).includes(type)
}

export const isValidImageType = (type: string) => {
  const imageType = (IMAGE_MIME_TYPE as readonly string[]).map((elm) => elm.split('/')[1])

  imageType.push('jpg')
  return imageType.includes(type)
}

// recommandation about salt when using it with hahsing
// https://stackoverflow.com/questions/1645161/salt-generation-and-open-source-software/1645190#1645190
export const generate_hash = (password: string) => {
  const salt = process.env.SALT
  if (salt)
    return crypto.pbkdf2Sync(password.normalize(), salt, 100000, 64, 'sha256').toString('hex')
  else throw Error('Salt for generate hash is missing')
}

export const verify_hash = (password: string, cipher: string) => {
  const salt = process.env.SALT
  if (salt)
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password.normalize(), salt, 100000, 64, 'sha256', (err, verify) => {
        if (err) reject(err)
        const isValidPassword = verify.toString('hex') === cipher
        resolve(isValidPassword)
      })
    })
  else throw Error('Salt for verify hash is missing')
}
