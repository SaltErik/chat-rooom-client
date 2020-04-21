import { log, dir } from "../utils/console";
const style = [
  `font-weight: bold`,
  `color: rgb(250, 218, 94)`,
  `font-size: 1em`,
].join(`;`);

/** Convenience function for console-logging informative events, as indicated by the yellow text and "[?]" symbol. */
const hay = (text: string, error?: Error): void => {
  log(`%c[!] ${text}`, style);
  if (error) {
    dir(error);
  }
};

export { hay };
