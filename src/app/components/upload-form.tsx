"use client"

import { Button, Flex, Group, Modal, Text, Textarea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import {
  Dropzone,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
} from "@mantine/dropzone"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"

function UploadForm() {
  const [opened, { open, close }] = useDisclosure(false)
  const [code, setCode] = useState<string>("")

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      text: "",
    },
  })

  const objectMutation = useMutation({
    mutationFn: async (values: { text: string; objectKey: string }) => {
      return fetch("/api/s3", {
        method: "PUT",
        body: JSON.stringify(values),
      })
    },
  })

  const dbMutation = useMutation({
    mutationFn: async (values: { objectKey: string }) => {
      return fetch("/api/share", {
        method: "POST",
        body: JSON.stringify(values),
      })
    },
  })

  const { refetch: getUUID } = useQuery({
    queryKey: ["/uuid/get"],
    queryFn: async () => {
      const response = await fetch("/api/uuid", { method: "GET" })
      return response.json()
    },
    enabled: false, // Disable automatic fetching
  })

  const handleSubmit = async (values: { text: string }) => {
    const { data: uuid } = await getUUID()

    await objectMutation.mutateAsync({ text: values.text, objectKey: uuid.data })
    const response = await dbMutation.mutateAsync({ objectKey: uuid.data })
    const { data: shares } = await response.json()

    if (shares) {
      setCode(shares.at(0).otp_code)
      open()
    }

    form.setFieldValue("text", "")

    notifications.show({
      message: "Upload completed!",
    })
  }

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <Text>Your code is: {code}</Text>
      </Modal>
      <form onSubmit={form.onSubmit(async (values) => await handleSubmit(values))}>
        <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap" mt="lg">
          <Textarea
            label="Your message"
            className="w-9/12"
            placeholder="text..."
            key={form.key("text")}
            {...form.getInputProps("text")}
          />
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={[
              ...IMAGE_MIME_TYPE,
              ...PDF_MIME_TYPE,
              ...MS_WORD_MIME_TYPE,
              ...MS_EXCEL_MIME_TYPE,
              ...MS_POWERPOINT_MIME_TYPE,
            ]}
            className="w-9/12"
          >
            <Group style={{ pointerEvents: "none" }}>
              <Dropzone.Accept>
                <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed 5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
          <Button className="m-auto w-9/12" type="submit">
            Go 🚚
          </Button>
        </Flex>
      </form>
    </>
  )
}

export default UploadForm
