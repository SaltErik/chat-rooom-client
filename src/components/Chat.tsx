import TextField from "@material-ui/core/TextField";
import React from "react";
import { Inbox } from "../typings/declarations";
import { MessageBox } from "./MessageBox";

interface Props {
  onSubmit: (event: React.KeyboardEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  messages: Inbox.Message[];
  username: string;
  inputfield: string;
}

const Chat: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  console.count(`Chat: render`);
  const { onSubmit, onChange, messages, username, inputfield } = props;

  return (
    <>
      <MessageBox messages={messages} username={username} />
      <TextField
        fullWidth
        autoFocus
        multiline
        margin="normal"
        label="Message"
        rows="4"
        value={inputfield}
        onChange={onChange}
        onKeyDown={onSubmit}
      />
    </>
  );
};

const memoized = React.memo<Props>(Chat);

export { memoized as Chat };
