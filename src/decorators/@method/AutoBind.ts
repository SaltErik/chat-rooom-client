const classesToDescriptorsTable = new WeakMap<any, any>();

const classDecorator = (targetClass: any): void => {
  const classPrototype = targetClass.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(classPrototype);
  classesToDescriptorsTable.set(classPrototype, descriptors);
};

/** Runs once per instance, applying the transformations en masse in the constructor.
 *
 * NOTE: Must be called manually in the constructor!
 *
 * A single call to `newInstanceBinder(this)` in the constructor replaces ALL other manual `.bind(this)`-calls, though.
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
 * The client decorates the desired methods with `@AutoBind`, and ALSO calls `AutoBind(this)` in the class constructor.
 *
 * Calling `Autobind(this)` in the constructor is what "activates" the hand-placed decorators in the end. */
function clientAPI(target: any): void | never {
  return "name" in target ? classDecorator(target) : newInstanceBinder(target);
}

export { clientAPI as AutoBind };
