"use client";

import { Flex, Group, Textarea, Text, Button } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
} from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { s3Client } from "@/utils/a3";
import * as crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";

function OneTimeSharePage() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      text: "",
    },
  });

  console.log(process.env.NEXT_PUBLIC_AWS_REGION!)

  const handleSubmit = async (values: { text: string }) => {
    const input = {
      Body: values.text,
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
      Key: "1234",
      ContentType: 'text/plain'
    };

    const command = new PutObjectCommand(input);

    const response = await s3Client.send(command);

    console.log(response);
  };

  return (
    <form onSubmit={form.onSubmit(async (values) => await handleSubmit(values))}>
      <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap" mt="lg">
        <Textarea
          label="Input label"
          description="Input description"
          placeholder="Input placeholder"
          className="w-9/12"
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
  );
}

export default OneTimeSharePage;
