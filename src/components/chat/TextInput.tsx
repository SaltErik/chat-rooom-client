import * as React from "react";
import { ChangeEvent, FC, KeyboardEvent } from "react";
import "../../styles/TextInput.css";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  mirror: string;
}

const TextInput: FC<Props> = ({ onChange, onKeyDown, mirror }): JSX.Element => {
  return (
    <div className="textinput">
      <input />
    </div>
  );
};

export { TextInput };
