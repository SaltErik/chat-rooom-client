import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FC, memo } from "react";
import { count } from "../utils/console";

const year = new Date().getFullYear();

interface Props {}

const Copyright: FC<Props> = (): JSX.Element => {
  count(`Copyright: render`);

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {`Copyright © `}
      <Link color="inherit" href="https://www.ui.com/">
        Ubiqwiti
      </Link>
      {` ${year}.`}
    </Typography>
  );
};

const memoized = memo<Props>(Copyright);

export { memoized as Copyright };
