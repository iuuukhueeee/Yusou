'use client'

import { Button, Flex, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { useForm } from '@mantine/form'

import CodeModal from '@/app/components/code-modal'
import Dropbox from '@/app/components/dropbox'
import useUUID from '@/hooks/useUUID'
import { FileWithPath } from '@mantine/dropzone'
import { useMutation } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'

interface S3UrlResponse {
  data: string
}

function UploadForm() {
  const [opened, { open, close }] = useDisclosure(false)
  const [code, setCode] = useState<string>('')
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [loading, { open: openLoading, close: closeLoading }] = useDisclosure()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      text: '',
      password: '',
    },
  })

  const dbMutation = useMutation({
    mutationFn: async (values: { objectKey: string; password: string }) => {
      return fetch('/api/share', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    },
  })

  const { refetch: getUUID } = useUUID()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    openLoading()

    try {
      const text = form.getValues().text
      const password = form.getValues().password

      if (text.length == 0 && files.length == 0) {
        notifications.show({
          message: 'Nothing to upload.',
        })
        return
      }

      // generate a new UUID via API
      const { data: uuid } = await getUUID()

      if (uuid?.data) {
        // handle files upload
        await Promise.all(
          files.map(async (file) => {
            const body = new Blob([file], {
              type: file.type,
            })

            const key = `${uuid.data}/${file.name}`
            const params = new URLSearchParams({
              key,
            })
            const response = await fetch(`/api/s3?${params.toString()}`)
            const url: S3UrlResponse = await response.json()

            await fetch(url.data, {
              method: 'PUT',
              body: body,
            })
          }),
        )

        // handle text upload
        if (text.length > 0) {
          const key = `${uuid.data}/text.txt`
          const params = new URLSearchParams({
            key,
          })
          const response = await fetch(`/api/s3?${params.toString()}`)
          const url: S3UrlResponse = await response.json()

          await fetch(url.data, {
            method: 'PUT',
            body: text,
          })
        }

        // generate a code when uploading is complete
        const response = await dbMutation.mutateAsync({ objectKey: uuid.data, password: password })
        const { data: shares } = await response.json()

        if (shares) {
          setCode(shares.at(0).otp_code)
          open()
        }

        form.setFieldValue('text', '')

        notifications.show({
          message: 'Upload completed!',
        })
      }
    } finally {
      closeLoading()
    }
  }

  return (
    <>
      <CodeModal close={close} code={code} opened={opened} />
      <form>
        <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap" mt="lg">
          <Textarea
            label="Your message"
            className="w-9/12"
            placeholder="text..."
            key={form.key('text')}
            {...form.getInputProps('text')}
          />
          <Textarea
            label="Your password if any"
            className="w-9/12"
            placeholder="password..."
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Dropbox files={files} setFiles={setFiles} />
          <Button className="m-auto w-9/12" type="submit" onClick={handleSubmit} loading={loading}>
            Go 🚚
          </Button>
        </Flex>
      </form>
    </>
  )
}

export default UploadForm
