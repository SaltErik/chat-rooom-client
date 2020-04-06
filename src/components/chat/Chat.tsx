import * as React from "react";
import { ChangeEvent, KeyboardEvent, PureComponent } from "react";
import { CountCalls } from "../../decorators/@class/CountCalls";
import { AutoBind } from "../../decorators/@method/AutoBind";
import { Inbox } from "../../typings/declarations";
import { Conversation } from "./Conversation";
import { TextInput } from "./TextInput";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  messages: Inbox.ChatMessage[];
  mirror: string;
  username: string;
}

interface State {}

@CountCalls
@AutoBind
class Chat extends PureComponent<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
    AutoBind(this);
  }

  render(this: Chat): JSX.Element {
    const { onChange, onKeyDown, messages, mirror, username }: Props = this.props;

    return (
      <>
        <Conversation messages={messages} username={username} />
        <TextInput onChange={onChange} onKeyDown={onKeyDown} mirror={mirror} />
      </>
    );
  }
}

export { Chat };
