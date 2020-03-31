import React from "react";

interface Props {
  text: string;
  author: string;
}

const Message: React.FunctionComponent<Props> = (props: Props) => {
  console.count(`Message: render`);
  const { text, author } = props;

  return <li>{`${author}: ${text}`}</li>;
};

const memoized = React.memo<Props>(Message);

export { memoized as Message };
