import * as React from "react";
import { FC, memo } from "react";
import { Redirect } from "react-router-dom";
import { count } from "../utils/console";

const splashPage = {
  pathname: "/join",
};

interface Props {}

const PitOfSuccess: FC<Props> = (): JSX.Element => {
  count(`PitOfSuccess: render`);

  return <Redirect to={splashPage} />;
};

const memoized = memo<Props>(PitOfSuccess);

export { memoized as PitOfSuccess };
