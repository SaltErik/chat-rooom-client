import * as React from "react";
import { FC, memo } from "react";
import { Inbox } from "../typings/declarations";
import { count, log } from "../utils/console";
import { Message } from "./Message";

interface Props {
  messages: Inbox.ChatMessage[];
  username: string;
}

const Conversation: FC<Props> = ({ messages, username }: Props): JSX.Element => {
  count(`Conversation: render`);

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
};

const memoized = memo<Props>(Conversation);

export { memoized as Conversation };
