import React from "react";
import { Inbox } from "../typings/declarations";
import { Message } from "./Message";

interface Props {
  messages: Inbox.Message[];
  username: string;
}

const MessageBox: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  console.count(`Conversation: render`);
  const { messages, username } = props;

  return (
    <div className="conversation">
      <ul>
        {messages.map((message) => {
          const { text, author, UUID } = message;
          const displayName = username === author ? `You` : author;
          return <Message key={UUID} text={text} author={displayName} />;
        })}
      </ul>
    </div>
  );
};

const memoized = React.memo<Props>(MessageBox);

export { memoized as MessageBox };
