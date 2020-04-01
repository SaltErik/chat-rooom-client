import { count, log } from "console";
import React from "react";
import { Inbox } from "../typings/declarations";
import { Message } from "./Message";

interface Props {
  messages: Inbox.ChatMessage[];
  username: string;
}

const Conversation: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  count(`Conversation: render`);
  const { messages, username } = props;

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

const memoized = React.memo<Props>(Conversation);

export { memoized as Conversation };
