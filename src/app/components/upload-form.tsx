"use client";

import { Button, Flex, Group, Text, Textarea } from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
} from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

function UploadForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      text: "",
    },
  });

  const objectMutation = useMutation({
    mutationFn: (values: { text: string }) => {
      return fetch("/api/s3", {
        method: "PUT",
        body: JSON.stringify(values),
      });
    },
  });

  const handleSubmit = (values: { text: string }) => {
    objectMutation.mutate(values);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
  );
}

export default UploadForm;
