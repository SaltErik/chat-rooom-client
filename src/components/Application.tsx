import React from "react";
import { Inbox, Outbox } from "../typings/declarations";
import { nay } from "../utils/nay";
import { isChat, isUsername } from "../utils/typeguards";
import { yay } from "../utils/yay";
import { Chat } from "./Chat";
import { SignIn } from "./SignIn";

interface Props {}

interface State {
  serverSettings: {
    port: number;
    protocol: `ws://` | `wss://`;
    domain: string;
  };
  ws: WebSocket | null;
  username: string;
  pendingUsername: string;
  chatField: string;
  usernameField: string;
  messages: Inbox.ChatMessage[];
  isUsernameAccepted: boolean;
}

class Application extends React.PureComponent<Props, State> {
  state: State = {
    serverSettings: {
      port: 443,
      protocol: `ws://`,
      domain: `localhost`,
    },
    ws: null,
    username: "",
    pendingUsername: "",
    chatField: "",
    usernameField: "",
    messages: [],
    isUsernameAccepted: false,
  };

  constructor(props: Props) {
    super(props);
    console.count(`${this.constructor.name}: constructor`);
    this.handleChangingChatField = this.handleChangingChatField.bind(this);
    this.handleChangingUsernameField = this.handleChangingUsernameField.bind(this);
    this.submitChatMessage = this.submitChatMessage.bind(this);
    this.submitUsernameRequest = this.submitUsernameRequest.bind(this);
  }

  componentDidMount(this: Application): void {
    console.count(`${this.constructor.name}: componentDidMount`);
    this.establishServerConnection();
  }

  componentDidUpdate(this: Application): void {
    console.count(`${this.constructor.name}: componentDidUpdate`);
  }

  componentWillUnmount(this: Application): void {
    console.count(`${this.constructor.name}: componentWillUnmount`);
  }

  establishServerConnection(this: Application): void {
    console.count(`${this.constructor.name}: arrangeWebSocket`);
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(this.deriveServerURL());
      ws.onclose = this.handleConnectionClose.bind(this);
      ws.onerror = this.handleConnectionError.bind(this);
      ws.onmessage = this.recieve.bind(this);
      ws.onopen = this.handleConnectionOpen.bind(this);
    } catch {
      ws = null;
    } finally {
      this.setState(() => ({
        ws,
      }));
    }
  }

  deriveServerURL(this: Application): string {
    console.count(`${this.constructor.name}: deriveServerURL`);
    const { protocol, domain, port } = this.state.serverSettings;
    return `${protocol}${domain}:${port}`;
  }

  deserialize(this: Application, message: string): Inbox.ChatMessage {
    console.count(`${this.constructor.name}: deserialize`);
    let deserialized: Inbox.ChatMessage = {
      text: "",
      author: "",
      UUID: "",
    };
    try {
      deserialized = JSON.parse(message);
    } catch (error) {
      if (error instanceof SyntaxError) {
        nay(`Deserialization failed!`);
        console.error(error);
      } else {
        nay(`Rethrowing unexpected error...`);
        throw error;
      }
    } finally {
      return deserialized;
    }
  }

  handleChangingChatField(this: Application, event: React.ChangeEvent<HTMLInputElement>): void {
    console.count(`${this.constructor.name}: handleChange`);
    event.persist();
    this.setState(() => ({
      chatField: event.target.value,
    }));
  }

  handleChangingUsernameField(this: Application, event: React.ChangeEvent<HTMLInputElement>): void {
    console.count(`${this.constructor.name}: handleChange`);
    event.persist();
    this.setState(() => ({
      usernameField: event.target.value,
    }));
  }

  handleConnectionClose(this: Application, event: CloseEvent): void {
    console.count(`${this.constructor.name}: handleConnectionClose`);
    const { code, reason, wasClean } = event;
    if (wasClean) {
      yay(`Connection closed cleanly.`);
      if (code) yay(`Code: ${code}`);
      if (reason) yay(`Reason: ${reason}`);
    } else {
      nay(`Connection closed unexpectedly!`);
      if (code) nay(`Code: ${code}`);
      if (reason) nay(`Reason: ${reason}`);
    }
  }

  handleConnectionError(this: Application, event: Event): void {
    console.count(`${this.constructor.name}: handleConnectionError`);
    nay(`A connection error occured!`);
    console.warn(event);
  }

  handleConnectionOpen(this: Application, event: Event): void {
    console.count(`${this.constructor.name}: handleConnectionOpen`);
    const { url } = event.srcElement as any;
    if (url) {
      yay(`Connection established to ${url}!`);
    }
  }

  submitChatMessage(this: Application, event: React.KeyboardEvent): void {
    console.count(`${this.constructor.name}: submitChatMessage`);
    if (event.key === "Enter") {
      event.preventDefault();
      const { chatField, username } = this.state;
      const message: Outbox.ChatMessage = {
        text: chatField,
        author: username,
      };
      this.handleOutgoingChatMessage(message);
      this.setState(() => ({
        chatField: "",
      }));
    }
  }

  submitUsernameRequest(this: Application, event: React.FormEvent<HTMLFormElement>): void {
    console.count(`${this.constructor.name}: submitUsernameRequest`);
    event.preventDefault();
    this.setState(
      (prevState) => ({
        pendingUsername: prevState.usernameField,
      }),
      () => {
        const { pendingUsername } = this.state;
        const desiredUsername: Outbox.Username = {
          username: pendingUsername,
        };
        this.handleOutgoingUsername(desiredUsername);
      }
    );
    this.setState(() => ({
      usernameField: "",
    }));
  }

  handleIncomingUsername(this: Application, message: Inbox.Username): void {
    console.count(`${this.constructor.name}: handleIncomingUsername`);
    const { username, pendingUsername } = this.state;
    if (!username) {
      if (pendingUsername) {
        this.setState(() => ({
          username: pendingUsername,
          isUsernameAccepted: message.isUsernameAccepted,
          pendingUsername: "",
        }));
      }
    }
  }

  handleOutgoingUsername(this: Application, desiredUsername: Outbox.Username): void {
    console.count(`${this.constructor.name}: handleOutgoingUsername`);
    const { isUsernameAccepted } = this.state;
    if (isUsernameAccepted) {
      return nay(`Username is already accepted! This should not be sent, or even asked for...`);
    }
    const serialized: string = this.serialize(desiredUsername);
    this.transmit(serialized);
  }

  recieve(this: Application, event: MessageEvent): void {
    console.count(`${this.constructor.name}: recieve`);
    const message: Inbox.Message = this.deserialize(event.data);
    console.log(message);
    if (isChat(message)) {
      return this.handleIncomingChatMessage(message);
    }
    if (isUsername(message)) {
      return this.handleIncomingUsername(message);
    }
    nay(`UH-OH! Unknown message type recieved!`);
    console.log(message);
  }

  handleIncomingChatMessage(this: Application, message: Inbox.ChatMessage): void {
    console.count(`${this.constructor.name}: handleIncomingChatMessage`);
    if (!message.text) nay(`INCOMING: Text field was empty!`);
    if (!message.author) nay(`INCOMING: Author field was empty!`);
    if (!message.UUID) nay(`INCOMING: UUID field was empty!`);
    yay(`We got this!`);
    this.setState((prevState) => ({
      messages: [...prevState.messages, message],
    }));
  }

  handleOutgoingChatMessage(this: Application, message: Outbox.ChatMessage): void {
    console.count(`${this.constructor.name}: handleOutgoingChatMessage`);
    if (!message.text) nay(`OUTGOING: Text field was empty!`);
    if (!message.author) nay(`OUTGOING: Author field was empty!`);
    const serialized: string = this.serialize(message);
    this.transmit(serialized);
  }

  transmit(this: Application, message: string): void {
    console.count(`${this.constructor.name}: transmit`);
    const { ws } = this.state;
    if (ws?.readyState === 1) {
      ws.send(message);
    }
  }

  serialize(this: Application, message: Outbox.Message): string {
    console.count(`${this.constructor.name}: serialize`);
    let serialized = "";
    try {
      serialized = JSON.stringify(message);
    } catch (error) {
      if (error instanceof SyntaxError) {
        nay(`Serialization failed!`);
        console.error(error);
      } else {
        nay(`Rethrowing unexpected error...`);
        throw error;
      }
    } finally {
      return serialized;
    }
  }

  render(this: Application): JSX.Element {
    console.count(`${this.constructor.name}: render`);
    const { messages, username, chatField, usernameField, isUsernameAccepted } = this.state;

    if (isUsernameAccepted) {
      return (
        <Chat
          onChange={this.handleChangingChatField}
          onKeyDown={this.submitChatMessage}
          messages={messages}
          username={username}
          mirror={chatField}
        />
      );
    }

    return (
      <SignIn
        onSubmit={this.submitUsernameRequest}
        mirror={usernameField}
        onChange={this.handleChangingUsernameField}
      />
    );
  }
}

export { Application };
