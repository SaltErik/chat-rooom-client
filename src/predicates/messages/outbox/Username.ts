import { Outbox } from "../../../typings/outbox";

const isOutboxUsername = (message: Outbox.Message): message is Outbox.Username => {
  return `username` in message;
};

export { isOutboxUsername };
