import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { ChangeEvent, FC, KeyboardEvent, memo } from "react";
import "../styles/TextInput.css";
import { count } from "../utils/console";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  mirror: string;
}

const TextInput: FC<Props> = ({ onChange, onKeyDown, mirror }: Props): JSX.Element => {
  count(`TextInput: render`);

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

const memoized = memo<Props>(TextInput);

export { memoized as TextInput };
