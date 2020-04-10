import "normalize.css";
import * as React from "react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
// import { Root } from "./routes/Root";
import { SignIn } from "./components/landing/SignIn";

ReactDOM.render(
  <StrictMode>
    <SignIn />
  </StrictMode>,
  document.getElementById("root")
);
