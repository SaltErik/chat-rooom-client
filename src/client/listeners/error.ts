import { count, warn } from "../../utils/console";
import { nay } from "../../terminal/nay";

function handleError(this: WebSocket, event: Event): void {
  count(`client: handleError`);
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  nay(`A connection error occured!`);
  warn(event);
}

export { handleError };
