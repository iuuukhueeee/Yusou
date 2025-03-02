import { getData } from '@/app/actions/actions'
import { ResponseLink } from '@/types'
import { Anchor, Button, Flex, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { FormEvent, useState } from 'react'

function ReceiveForm() {
  const [data, setData] = useState<ResponseLink[]>([])
  const [loading, { open: openLoading, close: closeLoading }] = useDisclosure()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      code: '',
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    openLoading()

    try {
      const code = form.getValues().code
      if (code.length === 0) {
        notifications.show({ message: 'Code is empty!' })
        return
      }

      const res = await getData(code)
      if (res) setData(res)
    } finally {
      closeLoading()
    }
  }

  return (
    <form onSubmit={async (e) => await handleSubmit(e)}>
      <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
        <TextInput
          name="code"
          label="Code"
          className="w-9/12"
          placeholder="code..."
          key={form.key('code')}
          {...form.getInputProps('code')}
        />
        <Button className="m-auto w-9/12" type="submit" color="yellow" loading={loading}>
          Get 🚚
        </Button>
        {data.map((elm, index) => (
          <Anchor key={index} href={elm.presignedLink}>
            {elm.objectKey}
          </Anchor>
        ))}
      </Flex>
    </form>
  )
}

export default ReceiveForm
