const style = [
  `font-weight: bold`,
  `font-size: 1em`
].join(`;`);

/** Convenience function for console-logging failures, as indicated by the red text, and the "[!]" symbol. */
const say = (text: string) => {
  console.log(`%c[*] ${text}`, style);
};

export { say };
