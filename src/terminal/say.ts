import { log } from "../utils/console";

const style = [
  `font-weight: bold`,
  `font-size: 1em`,
].join(`;`);

/** Convenience function for console-logging in general, as indicated by the white text and "[*]" symbol. */
const say = (text: string): void => {
  log(`%c[*] ${text}`, style);
};

export { say };
