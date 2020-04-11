import { count } from "../../utils/console";
import { yay } from "../../terminal/yay";

function handleOpen(this: WebSocket, _event: Event): void {
  count(`client: handleOpen`);
  yay(`Connection established to ${this.url}!`);
}

export { handleOpen };
