'use client'

import { Button, Flex, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { useForm } from '@mantine/form'

import CodeModal from '@/app/components/code-modal'
import Dropbox from '@/app/components/dropbox'
import { FileWithPath } from '@mantine/dropzone'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'

function UploadForm() {
  const [opened, { open, close }] = useDisclosure(false)
  const [code, setCode] = useState<string>('')
  const [files, setFiles] = useState<FileWithPath[]>([])

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      text: '',
    },
  })

  const objectMutation = useMutation({
    mutationFn: async (values: { data: File | string; objectKey: string }) => {
      const formData = new FormData()
      formData.append('objectKey', values.objectKey)
      formData.append('data', values.data)
      return fetch('/api/s3', {
        method: 'PUT',
        body: formData,
      })
    },
  })

  const dbMutation = useMutation({
    mutationFn: async (values: { objectKey: string }) => {
      return fetch('/api/share', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    },
  })

  const { refetch: getUUID } = useQuery({
    queryKey: ['/uuid/get'],
    queryFn: async () => {
      const response = await fetch('/api/uuid', { method: 'GET' })
      return response.json()
    },
    enabled: false, // Disable automatic fetching
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // generate a new UUID via API
    const { data: uuid } = await getUUID()

    const text = form.getValues().text

    files.forEach(async (file) => {
      await objectMutation.mutateAsync({
        data: file,
        objectKey: uuid.data,
      })
    })

    if (text.length > 0) {
      await objectMutation.mutateAsync({
        data: text,
        objectKey: uuid.data,
      })
    }

    const response = await dbMutation.mutateAsync({ objectKey: uuid.data })
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
          <Dropbox files={files} setFiles={setFiles} />
          <Button className="m-auto w-9/12" type="submit" onClick={handleSubmit}>
            Go 🚚
          </Button>
        </Flex>
      </form>
    </>
  )
}

export default UploadForm
