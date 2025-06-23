import { GET } from '@/app/api/uuid/route'
import { assert, describe, test } from 'vitest'

describe('/api/uuid', () => {
  test('generate new uuid when calling', async () => {
    const res = await GET()

    const uuid = await res.json()

    assert.isNotNull(uuid)
  })
})
