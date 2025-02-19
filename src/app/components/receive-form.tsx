import { getData } from "@/app/actions/actions"
import { Button, Flex, Text, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { FormEvent, useState } from "react"

function ReceiveForm() {
  const [text, setText] = useState("")
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      code: "",
    },
  })

  // const query = useQuery({
  //   queryKey: ["code", 123],
  //   queryFn: async () => {
  //     const url = new URL("/api/share");
  //     url.searchParams.append("code", form.getValues().code);
  //     return fetch(url);
  //   },
  // });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const values = form.getValues()

    const res = await getData(values.code)
    if (res) setText(res.response)
  }

  return (
    <form onSubmit={async (e) => await handleSubmit(e)}>
      <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
        <TextInput
          name="code"
          label="Code"
          className="w-9/12"
          placeholder="code..."
          key={form.key("code")}
          {...form.getInputProps("code")}
        />
        <Button className="m-auto w-9/12" type="submit" color="yellow">
          Get 🚚
        </Button>
        <Text>{text}</Text>
      </Flex>
    </form>
  )
}

export default ReceiveForm
