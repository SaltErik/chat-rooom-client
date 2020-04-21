import * as React from "react";
import { FC } from "react";
import { Redirect } from "react-router-dom";

const splashPage = {
  pathname: "/join",
};

interface Props {}

const PitOfSuccess: FC<Props> = (): JSX.Element => {
  return <Redirect to={splashPage} />;
};

export { PitOfSuccess };
