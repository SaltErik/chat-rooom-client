import * as React from "react";
import { FC, memo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Application } from "../components/Application";
import { count } from "../utils/console";
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
