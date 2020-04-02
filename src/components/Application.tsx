import React from "react";
import { Inbox, Outbox } from "../typings/declarations";
import { count, log } from "../utils/console";
import { nay } from "../utils/nay";
import { rethrow } from "../utils/rethrow";
import { isInboxChatMessage, isInboxUsername } from "../utils/typePredicates";
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
    count(`${this.constructor.name}: constructor`);
    this.handleChangingChatField = this.handleChangingChatField.bind(this);
    this.handleChangingUsernameField = this.handleChangingUsernameField.bind(this);
    this.submitChatMessage = this.submitChatMessage.bind(this);
    this.submitUsernameRequest = this.submitUsernameRequest.bind(this);
  }

  componentDidMount(this: Application): void {
    count(`${this.constructor.name}: componentDidMount`);
    this.establishServerConnection();
  }

  componentDidUpdate(this: Application): void {
    count(`${this.constructor.name}: componentDidUpdate`);
  }

  componentWillUnmount(this: Application): void {
    count(`${this.constructor.name}: componentWillUnmount`);
  }

  private establishServerConnection(this: Application): void {
    count(`${this.constructor.name}: arrangeWebSocket`);
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(this.deriveServerURL());
      console.log(ws);
      ws.onclose = this.handleConnectionClose.bind(this);
      ws.onerror = this.handleConnectionError.bind(this);
      ws.onmessage = this.receive.bind(this);
      ws.onopen = this.handleConnectionOpen.bind(this);
    } catch (error) {
      nay(`WebSocket instantiation failed!`, error);
      ws = null;
    } finally {
      this.setState(() => ({
        ws,
      }));
    }
  }

  private deriveServerURL(this: Application): string {
    count(`${this.constructor.name}: deriveServerURL`);
    const { protocol, domain, port } = this.state.serverSettings;
    return `${protocol}${domain}:${port}`;
  }

  private deserialize(this: Application, message: string): Inbox.ChatMessage {
    count(`${this.constructor.name}: deserialize`);
    let deserialized: Inbox.ChatMessage = {
      text: "",
      author: "",
      UUID: "",
    };
    try {
      deserialized = JSON.parse(message);
    } catch (error) {
      error instanceof SyntaxError ? nay(`Deserialization failed!`, error) : rethrow(error);
    } finally {
      return deserialized;
    }
  }

  private handleChangingChatField(this: Application, event: React.ChangeEvent<HTMLInputElement>): void {
    count(`${this.constructor.name}: handleChange`);
    event.persist();
    this.setState(() => ({
      chatField: event.target.value,
    }));
  }

  private handleChangingUsernameField(this: Application, event: React.ChangeEvent<HTMLInputElement>): void {
    count(`${this.constructor.name}: handleChange`);
    event.persist();
    this.setState(() => ({
      usernameField: event.target.value,
    }));
  }

  private handleConnectionClose(this: Application, event: CloseEvent): void {
    count(`${this.constructor.name}: handleConnectionClose`);
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

  private handleConnectionError(this: Application, event: Event): void {
    count(`${this.constructor.name}: handleConnectionError`);
    event.preventDefault();
    nay(`A connection error occured!`);
    console.warn(event);
  }

  private handleConnectionOpen(this: Application, event: Event): void {
    count(`${this.constructor.name}: handleConnectionOpen`);
    const { url } = event.srcElement as any;
    if (url) {
      yay(`Connection established to ${url}!`);
    }
  }

  private submitChatMessage(this: Application, event: React.KeyboardEvent): void {
    count(`${this.constructor.name}: submitChatMessage`);
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

  private submitUsernameRequest(this: Application, event: React.FormEvent<HTMLFormElement>): void {
    count(`${this.constructor.name}: submitUsernameRequest`);
    event.preventDefault();
    this.setState(
      (state) => ({
        pendingUsername: state.usernameField,
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

  private handleIncomingUsername(this: Application, message: Inbox.Username): void {
    count(`${this.constructor.name}: handleIncomingUsername`);
    const { username, pendingUsername } = this.state;
    if (!username) {
      if (pendingUsername) {
        if (message.isUsernameAccepted) {
          this.setState(() => ({
            username: pendingUsername,
            isUsernameAccepted: true,
            pendingUsername: "",
          }));
        } else {
          this.setState(() => ({
            isUsernameAccepted: false,
            pendingUsername: "",
          }));
        }
      }
    }
  }

  private handleOutgoingUsername(this: Application, desiredUsername: Outbox.Username): void {
    count(`${this.constructor.name}: handleOutgoingUsername`);
    const { isUsernameAccepted } = this.state;
    if (isUsernameAccepted) {
      return nay(`Username is already accepted! This should not be sent, or even asked for...`);
    }
    const serialized: string = this.serialize(desiredUsername);
    this.transmit(serialized);
  }

  private receive(this: Application, event: MessageEvent): void {
    count(`${this.constructor.name}: receive`);
    const message: Inbox.Message = this.deserialize(event.data);
    log(message);
    if (isInboxChatMessage(message)) {
      return this.handleIncomingChatMessage(message);
    }
    if (isInboxUsername(message)) {
      return this.handleIncomingUsername(message);
    }
    nay(`UH-OH! Unknown message type recieved!`);
    log(message);
  }

  private handleIncomingChatMessage(this: Application, message: Inbox.ChatMessage): void {
    count(`${this.constructor.name}: handleIncomingChatMessage`);
    if (!message.text) nay(`INCOMING: Text field was empty!`);
    if (!message.author) nay(`INCOMING: Author field was empty!`);
    if (!message.UUID) nay(`INCOMING: UUID field was empty!`);
    yay(`We got this!`);
    this.setState((state) => ({
      messages: [...state.messages, message],
    }));
  }

  private handleOutgoingChatMessage(this: Application, message: Outbox.ChatMessage): void {
    count(`${this.constructor.name}: handleOutgoingChatMessage`);
    if (!message.text) nay(`OUTGOING: Text field was empty!`);
    if (!message.author) nay(`OUTGOING: Author field was empty!`);
    const serialized: string = this.serialize(message);
    this.transmit(serialized);
  }

  private transmit(this: Application, message: string): void {
    count(`${this.constructor.name}: transmit`);
    const { ws } = this.state;
    if (ws?.readyState === 1) {
      ws.send(message);
    }
  }

  private serialize(this: Application, message: Outbox.Message): string {
    count(`${this.constructor.name}: serialize`);
    let serialized = "";
    try {
      serialized = JSON.stringify(message);
    } catch (error) {
      error instanceof SyntaxError ? nay(`Serialization failed!`, error) : rethrow(error);
    } finally {
      return serialized;
    }
  }

  render(this: Application): JSX.Element {
    count(`${this.constructor.name}: render`);
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
