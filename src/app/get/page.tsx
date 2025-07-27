'use client'

import Icon from '@/app/components/Icon'
import { FILE_ICON_SVG } from '@/app/components/icons'
import getDataFromS3 from '@/lib/server/getDataFromS3'
import { ResponseLink } from '@/types'
import { isTurnstileExist } from '@/utils/turnstile'
import { Box, Button, Center, Flex, Paper, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { FormEvent, useEffect, useState } from 'react'

function ReceivePage() {
  const [retrievedFiles, setRetrievedFiles] = useState<ResponseLink[]>([])
  // const [error, setError] = useState<string | null>(null)
  const [loading, { open: openLoading, close: closeLoading }] = useDisclosure()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      code: '',
      password: '',
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    setRetrievedFiles([])
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

      const res = await getDataFromS3(code, turnstileRes, password)
      if (res) {
        // object not found
        if (res.length === 1 && res[0].additionalInfo) {
          if (res[0].additionalInfo) {
            notifications.show({ message: res[0].additionalInfo.message })
          }
        } else setRetrievedFiles(res)
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
    <Box className="flex justify-center items-center px-4 py-8 mb-10">
      <Paper
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
        py="lg"
        radius="md"
        shadow="sm"
      >
        <Center>
          <h1 className="text-3xl font-semibold my-4 md:text-4xl">Get your Files</h1>
          <Text fw={700} size="xl"></Text>
        </Center>
        <form onSubmit={async (e) => await handleSubmit(e)} method="POST">
          <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
            <TextInput
              name="code"
              label="Code"
              className="w-full"
              px="lg"
              placeholder="code..."
              key={form.key('code')}
              {...form.getInputProps('code')}
            />
            <Textarea
              label="Your password if any"
              className="w-full"
              px="lg"
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
        {/* <Stack bg="var(--mantine-color-body)" gap="md" mx={20} className="md:items-center ">
          {retrievedFiles.map((elm, index) => {
            const fileType = elm.objectKey.split('.').pop()
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
                  {elm.objectKey}`
                </Anchor>
              )
            }
          })}
        </Stack> */}

        {retrievedFiles && retrievedFiles.length > 0 && (
          <div className="mt-8 pt-6 px-6 border-t border-border-base block">
            <h4 className="text-base font-medium mb-2 text-textMuted">Files: </h4>
            <ul className="space-y-2.5">
              {retrievedFiles.map((file, index) => (
                <li
                  key={index}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-collapse border-border-base flex justify-between items-center transition-colors"
                >
                  <div className="flex items-center min-w-0 space-x-2.5">
                    <Icon
                      svgContent={FILE_ICON_SVG}
                      className="text-primary flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-9">
                      <span
                        className="font-medium text-text-base truncate block"
                        title={file.objectKey}
                      >
                        {file.objectKey}
                      </span>
                      {/* <span className="text-xs text-textMuted">{file.size}</span> */}
                      <span></span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.presignedLink, '_blank')}
                    className="!px-3 !py-1.5 flex-shrink-0 min-w-[80px]"
                  >
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Paper>
    </Box>
  )
}

export default ReceivePage
