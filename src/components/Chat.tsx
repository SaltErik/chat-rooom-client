import React from "react";
import { Inbox } from "../typings/declarations";
import { count } from "../utils/console";
import { Conversation } from "./Conversation";
import { TextInput } from "./TextInput";

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  messages: Inbox.ChatMessage[];
  username: string;
  mirror: string;
}

const Chat: React.FC<Props> = (props: Props): JSX.Element => {
  count(`Chat: render`);
  const { onKeyDown, onChange, messages, username, mirror } = props;

  return (
    <>
      <Conversation messages={messages} username={username} />
      <TextInput onChange={onChange} onKeyDown={onKeyDown} mirror={mirror}  />
    </>
  );
};

const memoized = React.memo<Props>(Chat);

export { memoized as Chat };
