import * as React from "react";
import { PureComponent } from "react";
import { CountCalls } from "../../decorators/@class/CountCalls";
import { AutoBind } from "../../decorators/@method/AutoBind";
import { Inbox } from "../../typings/declarations";
import { log } from "../../utils/console";
import { Message } from "./Message";

interface Props {
  messages: Inbox.ChatMessage[];
  username: string;
}

interface State {}

@CountCalls
@AutoBind
class Conversation extends PureComponent<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
    AutoBind(this);
  }

  render(this: Conversation): JSX.Element {
    const { messages, username }: Props = this.props;

    return (
      <ul>
        {messages.map((message) => {
          log(message);
          const { text, author, UUID } = message;
          const displayName = username === author ? `You` : author;
          return <Message key={UUID} text={text} author={displayName} />;
        })}
      </ul>
    );
  }
}

export { Conversation };
