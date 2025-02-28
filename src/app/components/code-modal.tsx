'use client'

import { Modal, Text } from '@mantine/core'

interface Props {
  opened: boolean
  close: () => void
  code: string
}

function CodeModal({ opened, close, code }: Props) {
  return (
    <Modal opened={opened} onClose={close} centered closeOnClickOutside={false}>
      <Text>Your code is: {code}</Text>
    </Modal>
  )
}

export default CodeModal
