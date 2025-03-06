import { IMAGE_MIME_TYPE } from '@mantine/dropzone'
import crypto from 'crypto'

export const generate_otp = () => {
  return crypto.randomInt(100000, 999999).toString()
}

type ValidImageMimeType = (typeof IMAGE_MIME_TYPE)[number]

export const isValidImageMimeType = (value: string): value is ValidImageMimeType => {
  // This cast is necessary because TypeScript's includes() doesn't narrow types automatically
  return (IMAGE_MIME_TYPE as readonly string[]).includes(value)
}
