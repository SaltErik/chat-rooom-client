import React from "react";
import { Inbox, Outbox } from "../typings/declarations";
import { nay } from "../utils/nay";
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
    this.handleSubmitChatMessage = this.handleSubmitChatMessage.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
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
      text: "ERROR",
      author: "ERROR",
      UUID: "ERROR",
    };
    try {
      deserialized = JSON.parse(message);
    } catch (error) {
      nay(`Deserialization failed!`);
      console.error(error);
    }
    return deserialized;
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
    console.error(event);
  }

  handleConnectionOpen(this: Application, event: Event): void {
    console.count(`${this.constructor.name}: handleConnectionOpen`);
    const { url } = event.srcElement as any;
    if (url) {
      yay(`Connection established to ${url}!`);
    }
  }

  handleSubmitChatMessage(this: Application, event: React.KeyboardEvent): void {
    console.count(`${this.constructor.name}: handleSubmitChatMessage`);
    if (event.key === "Enter") {
      event.preventDefault();
      const { chatField, username } = this.state;
      const message: Outbox.ChatMessage = {
        text: chatField,
        author: username,
      };
      this.transmit(message);
      this.setState(() => ({
        chatField: "",
      }));
    }
  }

  handleSubmitUsername(this: Application, event: React.FormEvent<HTMLFormElement>): void {
    console.count(`${this.constructor.name}: handleSubmitUsername`);
    event.preventDefault();
    const { usernameField } = this.state;
    const desiredUsername: Outbox.Username = {
      username: usernameField,
    };
    this.transmit(desiredUsername);
    this.setState(() => ({
      usernameField: "",
    }));
  }

  handleUsernameAccepted(this: Application, message: Inbox.Username): void {
    console.count(`${this.constructor.name}: requestUsername`);
    this.setState(() => ({
      isUsernameAccepted: message.isUsernameAccepted,
    }));
  }

  recieve(this: Application, event: MessageEvent): void {
    console.count(`${this.constructor.name}: recieve`);
    const message: Inbox.Message = this.deserialize(event.data);
    const { isUsernameAccepted } = this.state;
    if (isUsernameAccepted) {
      yay(`Username is accepted! Skipping check...`);
      return this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }));
    }
    nay(`Username is not yet accepted! Performing check...`);
    if (`isUsernameAccepted` in message) {
      yay(`Message was of type Username.`);
      if ((message as Inbox.Username).isUsernameAccepted) {
        this.handleUsernameAccepted(message as Inbox.Username);
      }
    }
  }

  transmit(this: Application, message: Outbox.Message): void {
    console.count(`${this.constructor.name}: transmit`);
    const { ws } = this.state;
    if (ws?.readyState === 1) {
      ws.send(this.serialize(message));
    }
  }

  serialize(this: Application, message: Outbox.Message): string {
    console.count(`${this.constructor.name}: serialize`);
    let serialized = "";
    try {
      serialized = JSON.stringify(message);
    } catch (error) {
      nay(`Serialization failed!`);
      console.warn(error);
    } finally {
      return serialized;
    }
  }

  render(this: Application): JSX.Element {
    console.count(`${this.constructor.name}: render`);
    const { messages, username, chatField, usernameField, isUsernameAccepted } = this.state;

    if (isUsernameAccepted) {
      return (
        <>
          <Chat
            onChange={this.handleChangingChatField}
            onSubmit={this.handleSubmitChatMessage}
            messages={messages}
            username={username}
            mirror={chatField}
          />
        </>
      );
    }

    return (
      <>
        <SignIn
          onSubmit={this.handleSubmitUsername}
          mirror={usernameField}
          onChange={this.handleChangingUsernameField}
        />
      </>
    );
  }
}

export { Application };
