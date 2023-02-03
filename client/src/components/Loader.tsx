import { Flex, Spinner, Text } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      align={"center"}
      justify={"center"}
      direction={"column"}
      gap={"4"}
    >
      <Spinner
        variant={"page"}
        size={"lg"}
        emptyColor={"gray.200"}
        thickness={"3px"}
      />
      <Text fontWeight={"bold"} fontSize={"xl"}>
        Loading...
      </Text>
    </Flex>
  );
};

export default Loader;
