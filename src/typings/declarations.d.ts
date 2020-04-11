export interface IndexableObject {
  [key: string]: any;
}

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export interface ServerSettings {
  port: number;
  protocol: `ws://` | `wss://`;
  domain: `localhost`;
}
