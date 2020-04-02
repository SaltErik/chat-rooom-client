import { Inbox, Outbox } from "../typings/declarations";

const isInboxChatMessage = (message: Inbox.Message): message is Inbox.ChatMessage => {
  return `UUID` in message;
};

const isOutboxChatMessage = (message: Outbox.Message): message is Outbox.ChatMessage => {
  return `text` in message && !(`UUID` in message);
};

const isInboxUsername = (message: Inbox.Message): message is Inbox.Username => {
  return `isUsernameAccepted` in message;
};

const isOutboxUsername = (message: Outbox.Message): message is Outbox.Username => {
  return `username` in message;
};

export { isInboxChatMessage, isInboxUsername, isOutboxChatMessage, isOutboxUsername };
