import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { Root } from "./components/routes/Root";

ReactDOM.render(
  <StrictMode>
    <Root />
  </StrictMode>,
  document.getElementById("root")
);
