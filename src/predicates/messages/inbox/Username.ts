import { Inbox } from "../../../typings/inbox";

const isInboxUsername = (message: Inbox.Message): message is Inbox.Username => {
  return `isUsernameAccepted` in message;
};

export { isInboxUsername };
