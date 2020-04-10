import * as React from "react";
import { ChangeEvent, FormEvent, PureComponent } from "react";
import { AutoBind } from "../../decorators/AutoBind";
import { CountCalls } from "../../decorators/CountCalls";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  mirror: string;
}

interface State {}

@CountCalls
@AutoBind
class SignIn extends PureComponent<Props, State> {
  render(this: SignIn): JSX.Element {
    const { onChange, onSubmit, mirror }: Props = this.props;

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
          <div className="checkbox mb-3">
            <label>{/* <input type="checkbox" value="remember-me">
                Remember me
              </input> */}</label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Sign in
          </button>
          <p className="mt-5 mb-3 text-muted">&copy;2017-2019</p>
        </form>
      </div>
    );
  }
}

export { SignIn };
