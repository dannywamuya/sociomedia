import { extendTheme } from "@chakra-ui/react";
import Link from "./components/Link";
import Spinner from "./components/Spinner";

const theme = extendTheme({
  components: {
    Spinner,
    Link,
  },
});

export default theme;
