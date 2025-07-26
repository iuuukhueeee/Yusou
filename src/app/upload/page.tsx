'use client'

import {
  Blockquote,
  Box,
  Button,
  Center,
  Flex,
  Paper,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { useForm } from '@mantine/form'

import FileDropzone from '@/app/components/dropzone/file-dropzone'
import { FileWithPreview } from '@/app/components/dropzone/types'
import useUUID from '@/hooks/useUUID'
import { FileWithPath } from '@mantine/dropzone'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { FormEvent, useCallback, useState } from 'react'

interface S3UrlResponse {
  data: string
}

function UploadForm() {
  // const [opened, { open, close }] = useDisclosure(false)
  const [code, setCode] = useState<string>('')
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [loading, { open: openLoading, close: closeLoading }] = useDisclosure()
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

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
          // open()
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

  const handleFileSelected = useCallback(
    (selectedFiles: FileWithPreview[]) => {
      setFiles(selectedFiles)
      if (
        selectedFiles.length > 0 &&
        error === 'Please provide a message or upload at least one file.'
      )
        setError(null)
    },
    [error],
  )

  return (
    <Box className="flex justify-center items-center px-4 py-8 mb-10">
      {/* <CodeModal close={close} code={code} opened={opened} /> */}
      <Paper
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
        py="lg"
        radius="md"
        shadow="sm"
      >
        <Box className="">
          <Center className="flex flex-col">
            <h1 className="text-3xl font-semibold">Upload your Files</h1>
            {code && (
              <Box className="min-w-full" px="lg">
                <Blockquote color="blue" mt="lg" className="!p-2">
                  <span className="font-bold">Your download code is: </span>
                  <Tooltip
                    label={isCopied ? 'Copied!' : 'Copy to Clipboard'}
                    onClick={() => {
                      navigator.clipboard.writeText(code)
                      setIsCopied(true)
                    }}
                    onMouseLeave={() => setIsCopied(false)}
                    className="inline cursor-pointer"
                  >
                    <Text fw={700}>{code}.</Text>
                  </Tooltip>
                  <Box>
                    <Link className="text-amber-600" href="/get" prefetch>
                      Get your files
                    </Link>
                    <span className="text-black"> — they&apos;ll be available for two days.</span>
                  </Box>
                </Blockquote>
              </Box>
            )}
          </Center>
          <form>
            <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap" mt="lg">
              <Textarea
                label="Your message (optional)"
                className="w-full"
                px="lg"
                placeholder="Type your secret message here..."
                key={form.key('text')}
                {...form.getInputProps('text')}
              />
              <Textarea
                label="Your password (optional)"
                className="w-full"
                px="lg"
                placeholder="Secure your files with a password..."
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              {/* <Dropbox files={files} setFiles={setFiles} /> */}
              <FileDropzone onFilesSelected={handleFileSelected} />
              <Button className="w-full" type="submit" onClick={handleSubmit} loading={loading}>
                Go 🚚
              </Button>
            </Flex>
          </form>
        </Box>
      </Paper>
    </Box>
  )
}

export default UploadForm
