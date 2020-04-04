import * as React from "react";
import { ChangeEvent, FC, KeyboardEvent, memo } from "react";
import { Inbox } from "../typings/declarations";
import { count } from "../utils/console";
import { Conversation } from "./Conversation";
import { TextInput } from "./TextInput";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  messages: Inbox.ChatMessage[];
  mirror: string;
  username: string;
}

const Chat: FC<Props> = ({ onKeyDown, onChange, messages, username, mirror }: Props): JSX.Element => {
  count(`Chat: render`);

  return (
    <>
      <Conversation messages={messages} username={username} />
      <TextInput onChange={onChange} onKeyDown={onKeyDown} mirror={mirror} />
    </>
  );
};

const memoized = memo<Props>(Chat);

export { memoized as Chat };
