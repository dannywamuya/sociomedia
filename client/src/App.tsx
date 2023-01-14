import "./App.css";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState<number>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    axios
      .get("https://sociomedia.onrender.com/api/health")
      .then((v) => setStatus(v.status))
      .catch((error: AxiosError) => setError(error.message));
  }, []);

  return (
    <>{error ? `Error: ${error}` : status ? `Server Health: ${status}` : ""}</>
  );
}

export default App;
