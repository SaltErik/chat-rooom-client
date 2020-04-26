import * as React from "react";
import { ChangeEvent, FC, FormEvent } from "react";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  mirror: string;
}

const SignIn: FC<Props> = ({ onChange, onSubmit, mirror }): JSX.Element => {
  return (
    <div className="text-center">
      <form className="form-signin" onSubmit={onSubmit}>
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label className="sr-only" htmlFor="inputEmail">
          Email address
        </label>
        <input className="form-control" id="inputEmail" placeholder="Email address" required type="email"></input>
        <label className="sr-only" htmlFor="inputPassword">
          Password
        </label>
        <input className="form-control" id="inputPassword" type="password" placeholder="Password" required></input>
        <div className="checkbox mb-3"></div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export { SignIn };
