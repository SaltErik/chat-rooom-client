import * as React from "react";
import { PureComponent } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Application } from "../components/Application";
import { CountCalls } from "../decorators/@class/CountCalls";
import { AutoBind } from "../decorators/@method/AutoBind";
import { PitOfSuccess } from "./PitOfSuccess";

interface Props {}

interface State {}

@CountCalls
@AutoBind
class Root extends PureComponent<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
    AutoBind(this);
  }

  render(this: Root): JSX.Element {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Application} />
          <Route path="/" component={PitOfSuccess} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export { Root };
