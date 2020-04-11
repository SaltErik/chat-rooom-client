import { Inbox } from "../../../typings/inbox";

const isInboxChatMessage = (message: Inbox.Message): message is Inbox.ChatMessage => {
  return `UUID` in message;
};

export { isInboxChatMessage };
