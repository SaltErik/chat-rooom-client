import * as React from "react";
import { FC } from "react";
import { Inbox } from "../../typings/inbox";
import { log } from "../../utils/console";
import { Message } from "./Message";

interface Props {
  messages: Inbox.ChatMessage[];
  username: string;
}

const Conversation: FC<Props> = ({ messages, username }): JSX.Element => {
  return (
    <ul className="list-group">
      {messages.map(
        ({ text, author, UUID }): JSX.Element => {
          log({ text, author, UUID });
          const displayName = username === author ? `You` : author;
          return <Message key={UUID} text={text} author={displayName} />;
        }
      )}
    </ul>
  );
};

export { Conversation };
