import * as React from "react";
import { ChangeEvent, FC, KeyboardEvent } from "react";
import { Inbox } from "../../typings/inbox";
import { Conversation } from "./Conversation";
import { TextInput } from "./TextInput";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  messages: Inbox.ChatMessage[];
  mirror: string;
  username: string;
}

const Chat: FC<Props> = ({ onChange, onKeyDown, messages, mirror, username }): JSX.Element => {
  return (
    <>
      <Conversation messages={messages} username={username} />
      <TextInput onChange={onChange} onKeyDown={onKeyDown} mirror={mirror} />
    </>
  );
};

export { Chat };
