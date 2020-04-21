import * as React from "react";
import { FC } from "react";

interface Props {
  author: string;
  text: string;
}

const Message: FC<Props> = ({ author, text }): JSX.Element => {
  return <li className="list-group-item">{`${author}: ${text}`}</li>;
};

export { Message };
