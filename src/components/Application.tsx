import * as React from "react";
import { ChangeEvent, FormEvent, KeyboardEvent, PureComponent } from "react";
import { arrangeWebSocketConnection } from "../client/arrange";
import { serialize } from "../client/serialize";
import { Inbox, Outbox } from "../typings/declarations";
import { count } from "../utils/console";
import { nay } from "../utils/nay";
import { Chat } from "./Chat";
import { SignIn } from "./SignIn";

interface Props {}

interface State {
  chatField: string;
  isUsernameAccepted: boolean;
  messages: Inbox.ChatMessage[];
  pendingUsername: string;
  username: string;
  usernameField: string;
  ws: WebSocket | null;
}

class Application extends PureComponent<Props, State> {
  state: State = {
    chatField: "",
    isUsernameAccepted: false,
    messages: [],
    pendingUsername: "",
    username: "",
    usernameField: "",
    ws: null,
  };

  constructor(props: Props) {
    super(props);
    count(`${this.constructor.name}: constructor`);
    this.handleChangingChatField = this.handleChangingChatField.bind(this);
    this.handleChangingUsernameField = this.handleChangingUsernameField.bind(this);
    this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
  }

  componentDidMount(this: Application): void {
    count(`${this.constructor.name}: componentDidMount`);
    const ws = arrangeWebSocketConnection(this);
    if (ws) {
      this.setState(() => ({
        ws,
      }));
    }
  }

  componentDidUpdate(this: Application): void {
    count(`${this.constructor.name}: componentDidUpdate`);
  }

  componentWillUnmount(this: Application): void {
    count(`${this.constructor.name}: componentWillUnmount`);
  }

  handleChangingChatField(this: Application, event: ChangeEvent<HTMLInputElement>): void {
    count(`${this.constructor.name}: handleChange`);
    event.persist();
    this.setState(() => ({
      chatField: event.target.value,
    }));
  }

  handleChangingUsernameField(this: Application, event: ChangeEvent<HTMLInputElement>): void {
    count(`${this.constructor.name}: handleChange`);
    event.persist();
    this.setState(() => ({
      usernameField: event.target.value,
    }));
  }

  handleSubmitMessage(this: Application, event: KeyboardEvent): void {
    count(`${this.constructor.name}: handleSubmitMessage`);
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

  handleSubmitUsername(this: Application, event: FormEvent<HTMLFormElement>): void {
    count(`${this.constructor.name}: handleSubmitUsername`);
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

  handleIncomingUsername(this: Application, message: Inbox.Username): void {
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

  handleOutgoingUsername(this: Application, desiredUsername: Outbox.Username): void {
    count(`${this.constructor.name}: handleOutgoingUsername`);
    const { isUsernameAccepted } = this.state;
    if (isUsernameAccepted) {
      return nay(`Username is already accepted! This should not be sent, or even asked for...`);
    }
    const serialized: string = serialize(desiredUsername);
    this.transmit(serialized);
  }

  handleIncomingChatMessage(this: Application, message: Inbox.ChatMessage): void {
    count(`${this.constructor.name}: handleIncomingChatMessage`);
    if (!message.text) nay(`INCOMING: Text field was empty!`);
    if (!message.author) nay(`INCOMING: Author field was empty!`);
    if (!message.UUID) nay(`INCOMING: UUID field was empty!`);
    this.setState((state) => ({
      messages: [...state.messages, message],
    }));
  }

  handleOutgoingChatMessage(this: Application, message: Outbox.ChatMessage): void {
    count(`${this.constructor.name}: handleOutgoingChatMessage`);
    if (!message.text) nay(`OUTGOING: Text field was empty!`);
    if (!message.author) nay(`OUTGOING: Author field was empty!`);
    const serialized: string = serialize(message);
    this.transmit(serialized);
  }

  transmit(message: string): void {
    count(`client: transmit`);
    const { ws } = this.state;
    if (ws?.readyState === 1) {
      ws.send(message);
    }
  }

  render(this: Application): JSX.Element {
    count(`${this.constructor.name}: render`);
    const { messages, username, chatField, usernameField, isUsernameAccepted } = this.state;

    if (isUsernameAccepted) {
      return (
        <Chat
          onChange={this.handleChangingChatField}
          onKeyDown={this.handleSubmitMessage}
          messages={messages}
          mirror={chatField}
          username={username}
        />
      );
    }

    return (
      <SignIn
        onChange={this.handleChangingUsernameField}
        onSubmit={this.handleSubmitUsername}
        mirror={usernameField}
      />
    );
  }
}

export { Application };
