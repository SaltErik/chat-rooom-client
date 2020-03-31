import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Application } from "./Application";
import { PitOfSuccess } from "./PitOfSuccess";

interface Props {}

const Root: React.FunctionComponent<Props> = (): JSX.Element => {
  console.count(`Root: render`);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Application} />
        <Route path="/" component={PitOfSuccess} />
      </Switch>
    </BrowserRouter>
  );
};

const memoized = React.memo<Props>(Root);

export { memoized as Root };
