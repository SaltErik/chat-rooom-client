import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Application } from "../Application";
import { PitOfSuccess } from "./PitOfSuccess";

interface Props {}

const Root: React.FC<Props> = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Application} />
        <Route path="/" component={PitOfSuccess} />
      </Switch>
    </BrowserRouter>
  );
};

export { Root };
