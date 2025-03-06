'use client'

import { getData } from '@/app/actions/actions'
import { ResponseLink } from '@/types'
import { Anchor, Button, Flex, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { FormEvent, useState } from 'react'

function ReceiveForm() {
  const [data, setData] = useState<ResponseLink[]>([])
  const [loading, { open: openLoading, close: closeLoading }] = useDisclosure()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      code: '',
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const turnstileRes = formData.get('cf-turnstile-response') as string

    openLoading()

    try {
      const code = form.getValues().code
      if (code.length === 0) {
        notifications.show({ message: 'Code is empty!' })
        return
      }

      const res = await getData(code, turnstileRes)
      if (res) {
        if (res.length === 1 && res[0].additionalInfo) {
          if (res[0].additionalInfo) {
            notifications.show({ message: res[0].additionalInfo.message })
          }
        } else setData(res)
      }
    } finally {
      closeLoading()
    }
  }

  return (
    <>
      <form onSubmit={async (e) => await handleSubmit(e)} method="POST">
        <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
          <TextInput
            name="code"
            label="Code"
            className="w-9/12"
            placeholder="code..."
            key={form.key('code')}
            {...form.getInputProps('code')}
          />
          <div className="cf-turnstile" data-sitekey="0x4AAAAAAA_hieyUIexG2yCJ"></div>
          <Button className="m-auto w-9/12" type="submit" color="yellow" loading={loading}>
            Get 🚚
          </Button>
        </Flex>
      </form>
      <Stack h={300} bg="var(--mantine-color-body)" gap="md" mx={20} className="md:items-center ">
        {data.map((elm, index) => (
          <Anchor key={index} href={elm.presignedLink} truncate="end">
            {elm.objectKey}
          </Anchor>
        ))}
      </Stack>
    </>
  )
}

export default ReceiveForm
