import * as React from "react";
import { FC, memo } from "react";
import { count } from "../../utils/console";

interface Props {
  author: string;
  text: string;
}

const Message: FC<Props> = ({ author, text }: Props) => {
  count(`Message: render`);

  return <li>{`${author}: ${text}`}</li>;
};

const memoized = memo<Props>(Message);

export { memoized as Message };
