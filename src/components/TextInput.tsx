import TextField from "@material-ui/core/TextField";
import React from "react";
import "../styles/TextInput.css";
import { count } from "../utils/console";

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  mirror: string;
}

const TextInput: React.FC<Props> = (props: Props): JSX.Element => {
  count(`TextInput: render`);
  const { onKeyDown, onChange, mirror } = props;

  return (
    <div className="textinput">
      <TextField
        onChange={onChange}
        onKeyDown={onKeyDown}
        fullWidth
        autoFocus
        margin="normal"
        label="Message"
        rows="4"
        value={mirror}
      />
    </div>
  );
};

const memoized = React.memo<Props>(TextInput);

export { memoized as TextInput };
