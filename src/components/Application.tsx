import * as React from "react";
import { ChangeEvent, FC, FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { arrangeWebSocketConnection } from "../client/arrange";
import { serialize } from "../client/serialize";
import { nay } from "../terminal/nay";
import { Inbox } from "../typings/inbox";
import { Outbox } from "../typings/outbox";
import { Chat } from "./chat/Chat";
import { SignIn } from "./landing/SignIn";

interface Props {}

const Application: FC<Props> = (): JSX.Element => {
  const [chatField, setChatField] = useState<string>("");
  const [isUsernameAccepted, setIsUsernameAccepted] = useState<boolean>(false);
  const [messages, setMessages] = useState<Inbox.ChatMessage[]>([]);
  const [pendingUsername, setPendingUsername] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernameField, setUsernameField] = useState<string>("");
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  // componentDidMount //////////////////////////////
  useEffect(() => {
    const handle = arrangeWebSocketConnection(Application);
    if (handle) {
      setWebsocket(handle);
    }
  }, []);

  const handleChangingChatField = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    const { value } = event.target;
    setChatField(value);
  };

  const handleChangingUsernameField = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    const { value } = event.target;
    setUsernameField(value);
  };

  const handleSubmitMessage = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      const message: Outbox.ChatMessage = {
        text: chatField,
        author: username,
      };
      handleOutgoingChatMessage(message);
      setChatField("");
    }
  };

  const handleSubmitUsername = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setPendingUsername(usernameField);
    const desiredUsername: Outbox.Username = {
      username: pendingUsername,
    };
    handleOutgoingUsername(desiredUsername);
    setUsername("");
  };

  const handleIncomingUsername = (message: Inbox.Username): void => {
    if (!username) {
      if (pendingUsername) {
        if (message.isUsernameAccepted) {
          setUsername(pendingUsername);
          setIsUsernameAccepted(true);
          setPendingUsername("");
        } else {
          setIsUsernameAccepted(false);
          setPendingUsername("");
        }
      }
    }
  };

  const handleOutgoingUsername = (desiredUsername: Outbox.Username): void => {
    const serialized: string = serialize(desiredUsername);
    transmit(serialized);
  };

  const handleIncomingChatMessage = (message: Inbox.ChatMessage): void => {
    const { text, author, UUID } = message;
    if (!text) nay(`INCOMING: Text field was empty!`);
    if (!author) nay(`INCOMING: Author field was empty!`);
    if (!UUID) nay(`INCOMING: UUID field was empty!`);
    setMessages([...messages, message]);
  };

  const handleOutgoingChatMessage = (message: Outbox.ChatMessage): void => {
    const { text, author } = message;
    if (!text) nay(`OUTGOING: Text field was empty!`);
    if (!author) nay(`OUTGOING: Author field was empty!`);
    const serialized: string = serialize(message);
    transmit(serialized);
  };

  const transmit = (message: string): void => {
    if (websocket && websocket.readyState === 1) {
      websocket.send(message);
    }
  };

  if (isUsernameAccepted) {
    return (
      <Chat onChange={handleChangingChatField} onKeyDown={handleSubmitMessage} messages={messages} mirror={chatField} username={username} />
    );
  }

  return <SignIn onChange={handleChangingUsernameField} onSubmit={handleSubmitUsername} mirror={usernameField} />;
};

export { Application };
