'use client'

import { getData } from '@/app/actions/actions'
import ImageWithLink from '@/app/components/image-with-link'
import { ResponseLink } from '@/types'
import { isValidImageType } from '@/utils/core'
import { isTurnstileExist } from '@/utils/turnstile'
import { Anchor, Button, Flex, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { FormEvent, useEffect, useState } from 'react'

function ReceiveForm() {
  const [data, setData] = useState<ResponseLink[]>([])
  const [loading, { open: openLoading, close: closeLoading }] = useDisclosure()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      code: '',
      password: '',
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const turnstileRes = formData.get('cf-turnstile-response') as string

    openLoading()

    try {
      const code = form.getValues().code
      const password = form.getValues().password
      if (code.length === 0) {
        notifications.show({ message: 'Code is empty!' })
        return
      }

      const res = await getData(code, turnstileRes, password)
      if (res) {
        // object not found
        if (res.length === 1 && res[0].additionalInfo) {
          if (res[0].additionalInfo) {
            notifications.show({ message: res[0].additionalInfo.message })
          }
        } else setData(res)
      }
    } finally {
      closeLoading()
      if (isTurnstileExist()) {
        window.turnstile.reset()
      }
    }
  }

  useEffect(() => {
    if (isTurnstileExist()) {
      if (window.turnstile)
        window.turnstile.render('#cf-turnstile', {
          sitekey: '0x4AAAAAAA_hieyUIexG2yCJ',
        })
    }

    return () => {
      if (isTurnstileExist()) if (window.turnstile) window.turnstile.remove()
    }
  }, [])

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
          <Textarea
            label="Your password if any"
            className="w-9/12"
            placeholder="password..."
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <div
            className="cf-turnstile"
            id="cf-turnstile"
            data-sitekey="0x4AAAAAAA_hieyUIexG2yCJ"
          ></div>
          <Button className="m-auto w-9/12" type="submit" color="yellow" loading={loading}>
            Get 🚚
          </Button>
        </Flex>
      </form>
      <Stack h={300} bg="var(--mantine-color-body)" gap="md" mx={20} className="md:items-center ">
        {data.map((elm, index) => {
          const fileType = elm.objectKey.split('.').pop()
          console.log(fileType)
          if (fileType && isValidImageType(fileType)) {
            return (
              <ImageWithLink
                key={index}
                objectKey={elm.objectKey}
                presignedLink={elm.presignedLink}
              />
            )
          } else {
            return (
              <Anchor key={index} href={elm.presignedLink} truncate="end">
                {elm.objectKey}
              </Anchor>
            )
          }
        })}
      </Stack>
    </>
  )
}

export default ReceiveForm
