export interface ResponseLink {
  objectKey: string
  presignedLink: string
  additionalInfo?: {
    message: string
    status: number
  }
}


declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turnstile: any;
  }
}
