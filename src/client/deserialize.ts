import { isSyntaxError } from "../predicates/errors/syntaxError";
import { Inbox } from "../typings/inbox";
import { count } from "../utils/console";
import { nay } from "../utils/nay";
import { rethrow } from "../utils/rethrow";

const deserialize = (message: string): Inbox.ChatMessage => {
  count(`client: deserialize`);
  let deserialized: Inbox.ChatMessage = {
    text: ``,
    author: ``,
    UUID: ``,
  };
  try {
    deserialized = JSON.parse(message.toString().normalize());
  } catch (error) {
    isSyntaxError(error) ? nay(`Deserialization failed!`, error) : rethrow(error);
  } finally {
    return deserialized;
  }
};

export { deserialize };
