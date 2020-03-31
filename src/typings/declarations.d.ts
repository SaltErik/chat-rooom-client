export namespace Inbox {
  export interface Message {
    text: string;
    author: string;
    UUID: string;
  }

  export interface Username {
    isUsernameAccepted: boolean;
  }
}

export namespace Outbox {
  export interface Message {
    text: string;
    author: string;
  }

  export interface Username {
    username: string;
  }
}

export interface Message {
  text?: string;
  author?: string;
  UUID?: string;
  username?: string;
}
