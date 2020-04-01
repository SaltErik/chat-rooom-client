import { count } from "console";
import React from "react";
import { Redirect } from "react-router-dom";

const splashPage = {
  pathname: "/join",
};

interface Props {}

const PitOfSuccess: React.FunctionComponent<Props> = (): JSX.Element => {
  count(`PitOfSuccess: render`);

  return <Redirect to={splashPage} />;
};

const memoized = React.memo<Props>(PitOfSuccess);

export { memoized as PitOfSuccess };
