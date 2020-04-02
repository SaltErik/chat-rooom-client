import React, { FC, memo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { count } from "../utils/console";
import { Application } from "./Application";
import { PitOfSuccess } from "./PitOfSuccess";

interface Props {}

const Root: FC<Props> = (): JSX.Element => {
  count(`Root: render`);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Application} />
        <Route path="/" component={PitOfSuccess} />
      </Switch>
    </BrowserRouter>
  );
};

const memoized = memo<Props>(Root);

export { memoized as Root };
