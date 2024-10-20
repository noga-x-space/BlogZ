import React from "react";
import ReactDOM from "react-dom/client";
//import "./index.css";
//import "./Homepage.css";
import App from "./App";
import { Provider } from "@lyket/react";
import "bootstrap/dist/css/bootstrap.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider apiKey="pt_bde810accdc7c6a3ae3edc38103468">
      <App />
    </Provider>
  </React.StrictMode>
);
