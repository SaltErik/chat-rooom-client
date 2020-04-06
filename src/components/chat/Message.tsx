import * as React from "react";
import { PureComponent } from "react";
import { CountCalls } from "../../decorators/@class/CountCalls";
import { AutoBind } from "../../decorators/@method/AutoBind";

interface Props {
  author: string;
  text: string;
}

interface State {}

@CountCalls
@AutoBind
class Message extends PureComponent<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
    AutoBind(this);
  }

  render(this: Message): JSX.Element {
    const { author, text }: Props = this.props;

    return <li>{`${author}: ${text}`}</li>;
  }
}

export { Message };
