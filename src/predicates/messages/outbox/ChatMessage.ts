import { Outbox } from "../../../typings/outbox";

const isOutboxChatMessage = (message: Outbox.Message): message is Outbox.ChatMessage => {
  return `text` in message && !(`UUID` in message);
};

export { isOutboxChatMessage };

