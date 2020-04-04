
const methodNames: PropertyKey[] = [];

/** Runs once for each method decorated with `@AutoBind`.
 *
 * Registers that name for future binding by the `constructTimeBinder`, which runs last (thanks to being called manually by the client in the class' constructor). */
const methodDecorator = (_target: Object, key: PropertyKey, _descriptor: PropertyDescriptor): void => {
  methodNames.push(key);
};

/** Runs once per instance, applying the transformations en masse in the constructor.
 *
 * NOTE: Must be called manually in the constructor!
 *
 * A call to `AutoBind(this)` in the constructor replaces all other manual `.bind(this)`-calls, though.
*/
const constructTimeBinder = (that: any): void => {
  for (let name of methodNames) {
    const method: Function = that[name];
    that[name] = method.bind(that);
  }
};

/** Provides a single entry point for consumers.
 *
 * The client decorates the desired methods with `@AutoBind`, and ALSO calls `AutoBind(this)` in the class constructor.
 *
 * Calling `Autobind(this)` in the constructor is what "activates" the hand-placed decorators in the end. */
function clientAPI(...args: any[]): void | never {
  switch (args.length) {
    case 1:
      return constructTimeBinder(args[0]);
    case 3:
      return methodDecorator(args[0], args[1], args[2]);
    default:
      throw new RangeError(`Expected 1 or 3 arguments, recieved ${args.length}!`);
  }
}

export { clientAPI as AutoBind };
