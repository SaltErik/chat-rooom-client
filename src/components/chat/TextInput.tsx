import * as React from "react";
import { ChangeEvent, KeyboardEvent, PureComponent } from "react";
import { AutoBind } from "../../decorators/AutoBind";
import { CountCalls } from "../../decorators/CountCalls";
import "../../styles/TextInput.css";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  mirror: string;
}

interface State {}

@CountCalls
@AutoBind
class TextInput extends PureComponent<Props, State> {
  render(this: TextInput): JSX.Element {
    const { onChange, onKeyDown, mirror }: Props = this.props;

    return (
      <div className="textinput">
        <input />
      </div>
    );
  }
}

export { TextInput };
