import React from "react";
import { count } from "../utils/console";

interface Props {
  text: string;
  author: string;
}

const Message: React.FC<Props> = (props: Props) => {
  count(`Message: render`);
  const { text, author } = props;

  return <li>{`${author}: ${text}`}</li>;
};

const memoized = React.memo<Props>(Message);

export { memoized as Message };
