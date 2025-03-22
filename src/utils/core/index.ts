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
  const imageType = (IMAGE_MIME_TYPE as readonly string[]).map(elm => elm.split('/')[1])

  imageType.push('jpg')
  return imageType.includes(type)
}