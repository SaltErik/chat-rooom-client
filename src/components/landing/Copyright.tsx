import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { PureComponent } from "react";
import { CountCalls } from "../../decorators/@class/CountCalls";
import { AutoBind } from "../../decorators/@method/AutoBind";

const year = new Date().getFullYear();

interface Props {}

interface State {}

@CountCalls
@AutoBind
class Copyright extends PureComponent<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
    AutoBind(this);
  }

  render(this: Copyright): JSX.Element {
    return (
      <Typography align="center" color="textSecondary" variant="body2">
        {`Copyright © `}
        <Link color="inherit" href="https://www.ui.com/">
          Ubiqwiti
        </Link>
        {` ${year}.`}
      </Typography>
    );
  }
}

export { Copyright };
