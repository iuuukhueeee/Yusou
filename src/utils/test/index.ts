import { NextRequest } from 'next/server'
import httpMocks, { RequestOptions } from 'node-mocks-http'

export const createNextRequest = (options: RequestOptions): NextRequest => {
  const mockReq = httpMocks.createRequest<NextRequest>(options)

  const host = mockReq.get('host') || 'localhost:3000'
  const path = mockReq.url

  const url = new URL(`http://${host}${path}`)

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const nextReq = new NextRequest(url, {
    method: mockReq.method,
    headers: mockReq.headers,
    body: JSON.stringify(mockReq.body) !== '{}' ? JSON.stringify(mockReq.body) : undefined,
  })

  return nextReq
}
