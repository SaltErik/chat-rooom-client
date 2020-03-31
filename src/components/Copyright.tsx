import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React from "react";

const Copyright: React.FunctionComponent = (): JSX.Element => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.ui.com/">
        Ubiqwiti
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export { Copyright };
