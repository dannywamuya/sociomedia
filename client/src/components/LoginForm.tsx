import { Flex, Checkbox, Link } from "@chakra-ui/react";
import { FieldValues } from "react-hook-form";
import { Form } from "./Form";
import { FormProps } from "./Form/types/types";
import { Link as RouterLink } from "@tanstack/react-location";

const fields: FormProps["fields"] = {
  email: {
    type: "text",
    htmlType: "email",
    label: "Email",
    placeholder: "Email",
  },
  password: {
    type: "text",
    htmlType: "password",
    label: "Password",
    placeholder: "Password",
  },
};

type ILogin =
  | {
      email: string;
      password: string;
    }
  | FieldValues;

export default function LoginForm() {
  const handleSubmit = (values: ILogin) => {
    console.log(values);
  };

  return (
    <Flex h={"100vh"} align={"center"} justify={"center"}>
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        styling={{
          submitText: "Login",
          formTitle: "",
        }}
      >
        <Flex justify={"space-between"} w={"full"}>
          <Checkbox>Remember Me</Checkbox>
          <Link>
            <RouterLink to={"/reset-password"}>Forgot password?</RouterLink>
          </Link>
        </Flex>
      </Form>
    </Flex>
  );
}
