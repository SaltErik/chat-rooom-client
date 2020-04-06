import * as React from "react";
import { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import { CountCalls } from "../decorators/@class/CountCalls";
import { AutoBind } from "../decorators/@method/AutoBind";

const splashPage = {
  pathname: "/join",
};

interface Props {}

interface State {}

@CountCalls
@AutoBind
class PitOfSuccess extends PureComponent<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
    AutoBind(this);
  }

  render(this: PitOfSuccess): JSX.Element {
    return <Redirect to={splashPage} />;
  }
}
export { PitOfSuccess };
