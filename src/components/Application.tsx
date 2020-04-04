import * as React from "react";
import { ChangeEvent, FormEvent, KeyboardEvent, PureComponent } from "react";
import { arrangeWebSocketConnection } from "../client/arrange";
import { serialize } from "../client/serialize";
import { AutoBind } from "../decorators/AutoBind";
import { CountCalls } from "../decorators/CountCalls";
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
    AutoBind(this);
  }

  @CountCalls
  @AutoBind
  componentDidMount(this: Application): void {
    const ws = arrangeWebSocketConnection(this);
    if (ws) {
      this.setState(() => ({
        ws,
      }));
    }
  }

  @CountCalls
  @AutoBind
  componentDidUpdate(this: Application): void {}

  @CountCalls
  @AutoBind
  componentWillUnmount(this: Application): void {}

  @CountCalls
  @AutoBind
  handleChangingChatField(this: Application, event: ChangeEvent<HTMLInputElement>): void {
    event.persist();
    this.setState(() => ({
      chatField: event.target.value,
    }));
  }

  @CountCalls
  @AutoBind
  handleChangingUsernameField(this: Application, event: ChangeEvent<HTMLInputElement>): void {
    event.persist();
    this.setState(() => ({
      usernameField: event.target.value,
    }));
  }

  @CountCalls
  @AutoBind
  handleSubmitMessage(this: Application, event: KeyboardEvent): void {
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

  @CountCalls
  @AutoBind
  handleSubmitUsername(this: Application, event: FormEvent<HTMLFormElement>): void {
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

  @CountCalls
  @AutoBind
  handleIncomingUsername(this: Application, message: Inbox.Username): void {
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

  @CountCalls
  @AutoBind
  handleOutgoingUsername(this: Application, desiredUsername: Outbox.Username): void {
    const { isUsernameAccepted } = this.state;
    if (isUsernameAccepted) {
      return nay(`Username is already accepted! This should not be sent, or even asked for...`);
    }
    const serialized: string = serialize(desiredUsername);
    this.transmit(serialized);
  }

  @CountCalls
  @AutoBind
  handleIncomingChatMessage(this: Application, message: Inbox.ChatMessage): void {
    if (!message.text) nay(`INCOMING: Text field was empty!`);
    if (!message.author) nay(`INCOMING: Author field was empty!`);
    if (!message.UUID) nay(`INCOMING: UUID field was empty!`);
    this.setState((state) => ({
      messages: [...state.messages, message],
    }));
  }

  @CountCalls
  @AutoBind
  handleOutgoingChatMessage(this: Application, message: Outbox.ChatMessage): void {
    if (!message.text) nay(`OUTGOING: Text field was empty!`);
    if (!message.author) nay(`OUTGOING: Author field was empty!`);
    const serialized: string = serialize(message);
    this.transmit(serialized);
  }

  @CountCalls
  @AutoBind
  transmit(message: string): void {
    const { ws } = this.state;
    if (ws?.readyState === 1) {
      ws.send(message);
    }
  }

  @CountCalls
  @AutoBind
  render(this: Application): JSX.Element {
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
      <SignIn onChange={this.handleChangingUsernameField} onSubmit={this.handleSubmitUsername} mirror={usernameField} />
    );
  }
}

export { Application };
