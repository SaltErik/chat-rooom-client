import React from "react";
import { Inbox } from "../typings/declarations";
import { Conversation } from "./Conversation";
import { TextInput } from "./TextInput";

interface Props {
  onKeyDown: (event: React.KeyboardEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  messages: Inbox.ChatMessage[];
  username: string;
  mirror: string;
}

const Chat: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  console.count(`Chat: render`);
  const { onKeyDown, onChange, messages, username, mirror } = props;

  return (
    <>
      <Conversation messages={messages} username={username} />
      <TextInput mirror={mirror} onChange={onChange} onKeyDown={onKeyDown} />
    </>
  );
};

const memoized = React.memo<Props>(Chat);

export { memoized as Chat };
