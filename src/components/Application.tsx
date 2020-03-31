import React from "react";
import { Inbox, Message, Outbox } from "../typings/declarations";
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
  inputfield: string;
  messages: Inbox.Message[];
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
    inputfield: "",
    messages: [],
    isUsernameAccepted: false,
  };

  constructor(props: Props) {
    super(props);
    console.count(`${this.constructor.name}: constructor`);
    this.establishServerConnection = this.establishServerConnection.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitChatMessage = this.handleSubmitChatMessage.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
  }

  componentDidMount(this: Application): void {
    console.count(`${this.constructor.name}: componentDidMount`);
    this.establishServerConnection();
  }

  componentDidUpdate(this: Application): void {
    console.count(`${this.constructor.name}: componentDidUpdate`);
    console.log(this.state);
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

  deserialize(this: Application, message: string): Inbox.Message {
    console.count(`${this.constructor.name}: deserialize`);
    let deserialized: Inbox.Message = {
      text: "ERROR",
      author: "ERROR",
      UUID: "ERROR",
    };
    try {
      deserialized = JSON.parse(message);
    } catch (error) {
      nay(`Deserialization failed!`);
      console.warn(error);
    }
    return deserialized;
  }

  handleChange(this: Application, event: React.ChangeEvent<HTMLInputElement>): void {
    console.count(`${this.constructor.name}: handleChange`);
    event.persist();
    this.setState(() => ({
      inputfield: event.target.value,
    }));
  }

  handleConnectionClose(this: Application, event: CloseEvent): void {
    console.count(`${this.constructor.name}: handleConnectionClose`);
    console.log(event);
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
    console.log(event);
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
      const { inputfield, username } = this.state;
      const message: Outbox.Message = {
        text: inputfield,
        author: username,
      };
      this.transmit(message);
      this.setState(() => ({
        inputfield: "",
      }));
    }
  }

  handleSubmitUsername(this: Application, event: React.FormEvent<HTMLFormElement>): void {
    console.count(`${this.constructor.name}: handleSubmitUsername`);
    event.preventDefault();
    console.log(event);
    this.setState(() => ({
      inputfield: "",
    }), () => this.requestUsername());
  }

  requestUsername(this: Application): void {
    console.count(`${this.constructor.name}: requestUsername`);
    const { inputfield } = this.state;
    const desiredUsername: Outbox.Username = {
      username: inputfield,
    };
    this.transmit(desiredUsername);
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
    this.setState((prevState) => ({
      messages: [...prevState.messages, message],
    }), () => {
      if ("isUsernameAccepted" in message) {
        this.handleUsernameAccepted(message);
      }
    });
  }

  transmit(this: Application, message: Message): void {
    console.count(`${this.constructor.name}: transmit`);
    const { ws } = this.state;
    if (ws?.readyState === 1) {
      ws.send(this.serialize(message));
    }
  }

  serialize(this: Application, message: Message): string {
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
    const { messages, username, inputfield, isUsernameAccepted } = this.state;

    if (isUsernameAccepted) {
      return (
        <>
          <Chat
            onChange={this.handleChange}
            onSubmit={this.handleSubmitChatMessage}
            messages={messages}
            username={username}
            inputfield={inputfield}
          />
        </>
      );
    }

    return (
      <>
        <SignIn onSubmit={this.handleSubmitUsername} />
      </>
    );
  }
}

export { Application };
