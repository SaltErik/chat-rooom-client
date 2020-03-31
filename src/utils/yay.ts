const style = [
  `font-weight: bold`,
  `color: #669900`,
  `font-size: 1em`
].join(`;`);

/** Convenience function for console-logging successes, as indicated by the red text, and the "[-]" symbol. */
const yay = (text: string) => {
  console.log(`%c[+] ${text}`, style);
};

export { yay };
