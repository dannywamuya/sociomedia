import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, ReactLocation, Router } from "@tanstack/react-location";
import routes from "./routes";
import theme from "./theme";

const queryClient = new QueryClient();
const locationClient = new ReactLocation();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router location={locationClient} routes={routes}>
          <Outlet />
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
