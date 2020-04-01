import TextField from "@material-ui/core/TextField";
import { count } from "console";
import React from "react";
import "../styles/TextInput.css";

interface Props {
  onKeyDown: (event: React.KeyboardEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mirror: string;
}

const TextInput: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  count(`TextInput: render`);
  const { onKeyDown, onChange, mirror } = props;

  return (
    <div className="textinput">
      <TextField
        fullWidth
        autoFocus
        margin="normal"
        label="Message"
        rows="4"
        value={mirror}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

const memoized = React.memo<Props>(TextInput);

export { memoized as TextInput };
