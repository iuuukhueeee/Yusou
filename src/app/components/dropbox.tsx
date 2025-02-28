'use client'

import {
  Dropzone,
  FileWithPath,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
} from '@mantine/dropzone'

import { isValidImageMimeType } from '@/utils/core'
import { Group, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import Image from 'next/image'

interface Props {
  files: FileWithPath[]
  setFiles: (files: FileWithPath[]) => void
}

function Dropbox({ files, setFiles }: Props) {
  const previews = files.map((file, index) => {
    if (isValidImageMimeType(file.type)) {
      const imageUrl = URL.createObjectURL(file)
      return (
        <Image
          key={index}
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
          width={300}
          height={200}
          alt={file.name}
        />
      )
    }
    return <div key={index}>{file.name}</div>
  })

  return (
    <>
      <Dropzone
        onDrop={setFiles}
        onReject={() => notifications.show({ message: 'Invalid files' })}
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
        <Group style={{ pointerEvents: 'none' }}>
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
      <Stack justify="center">{previews}</Stack>
    </>
  )
}

export default Dropbox
