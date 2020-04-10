import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent } from "react";
import { AutoBind } from "../../decorators/AutoBind";
import { CountCalls } from "../../decorators/CountCalls";

interface Props {}

interface State {}

@CountCalls
@AutoBind
class SignIn extends PureComponent<Props, State> {
  render(this: SignIn): JSX.Element {
    return (
      <div className="text-center">
        <form className="form-signin">
          <FontAwesomeIcon icon={faCoffee} />
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required></input>
          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required></input>
          <div className="checkbox mb-3">
            <label>
              {/* <input type="checkbox" value="remember-me">
                Remember me
              </input> */}
            </label>
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
