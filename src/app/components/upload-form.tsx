"use client"

import { Button, Flex, Textarea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"

import CodeModal from "@/app/components/code-modal"
import Dropbox from "@/app/components/dropbox"
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
      <CodeModal close={close} code={code} opened={opened} />
      <form onSubmit={form.onSubmit(async (values) => await handleSubmit(values))}>
        <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap" mt="lg">
          <Textarea
            label="Your message"
            className="w-9/12"
            placeholder="text..."
            key={form.key("text")}
            {...form.getInputProps("text")}
          />
          <Dropbox />
          <Button className="m-auto w-9/12" type="submit">
            Go 🚚
          </Button>
        </Flex>
      </form>
    </>
  )
}

export default UploadForm
