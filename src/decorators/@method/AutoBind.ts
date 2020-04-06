const classesToDescriptorsTable = new WeakMap<any, any>();

const classDecorator = (targetClass: any): void => {
  const classPrototype = targetClass.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(classPrototype);
  classesToDescriptorsTable.set(classPrototype, descriptors);
};

/** Runs once (per new instance - for that instance), applying the transformations en masse in the constructor.
 *
 * NOTE: `AutoBind(this)` must be called manually in the constructor!
 *
 * A single call to `AutoBind(this)` in the constructor replaces ALL other manual `.bind(this)`-calls, though.
 */
const newInstanceBinder = (that: any): void => {
  const classConstructor = that.constructor;
  const classPrototype = classConstructor.prototype;
  const descriptors = classesToDescriptorsTable.get(classPrototype);
  for (let descriptor in descriptors) {
    that[descriptor] = classPrototype[descriptor].bind(that);
  }
};

/** Provides a single entry point for consumers.
 *
 * The client decorates the desired class `@AutoBind`, and ALSO calls `AutoBind(this)` in the class constructor.
 *
 * Calling `Autobind(this)` in the constructor is what "activates" the hand-placed decorators in the end. */
function clientAPI(target: any): void | never {
  return "name" in target ? classDecorator(target) : newInstanceBinder(target);
}

export { clientAPI as AutoBind };
