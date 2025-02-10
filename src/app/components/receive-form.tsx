import { getData } from "@/app/actions/actions";
import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

function ReceiveForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      code: "",
    },
  });

  return (
    <form action={getData}>
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
      </Flex>
    </form>
  );
}

export default ReceiveForm;
