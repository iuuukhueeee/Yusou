export interface ResponseLink {
  objectKey: string
  presignedLink: string
  additionalInfo?: {
    message: string
    status: number
  }
}
