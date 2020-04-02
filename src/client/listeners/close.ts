import { count } from "../../utils/console";
import { nay } from "../../utils/nay";
import { yay } from "../../utils/yay";

function handleClose(this: WebSocket, event: CloseEvent): void {
  count(`client: handleClose`);
  const { code, reason, wasClean } = event;
  if (wasClean) {
    yay(`Connection closed cleanly.`);
    if (code) yay(`Code: ${code}`);
    if (reason) yay(`Reason: ${reason}`);
  } else {
    nay(`Connection closed unexpectedly!`);
    if (code) nay(`Code: ${code}`);
    if (reason) nay(`Reason: ${reason}`);
  }
}

export { handleClose };
