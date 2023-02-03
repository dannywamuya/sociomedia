import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-location";
import Loader from "./components/Loader";

interface IError {
  code: string;
  message: string;
}

const fetchFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        resolve(accessToken);
      } else {
        reject({ code: "LOGGED_OUT", message: "User is not logged in." });
      }
    }, 5000);
  });
};

function App() {
  const { data, isFetching, error } = useQuery<any, IError>(
    ["user"],
    fetchFunction
  );

  if (isFetching) {
    return <Loader />;
  }

  if (error && error.code === "LOGGED_OUT") {
    return <Navigate to="/login" />;
  }

  return <>{data ? `${JSON.stringify(data, null, 2)}` : `Uncaught error`}</>;
}

export default App;
