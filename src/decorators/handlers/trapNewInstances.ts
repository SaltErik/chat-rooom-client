import { isFunction } from "../../predicates/objects/function";

/** Ensures that instance methods can be safely passed (and invoked) as event handlers. */
const autoBindInstance = (instance: any) => {
  const classPrototype = instance.constructor.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(classPrototype);

  for (let descriptor in descriptors) {
    if (isFunction(classPrototype[descriptor])) {
      instance[descriptor] = classPrototype[descriptor].bind(instance);
    }
  }
  return instance;
};

const trapNewInstances = {
  construct(original: any, argumentsList: unknown[], _proxied: any) {
    const instance = new original(...argumentsList);
    const boundInstance = autoBindInstance(instance);
    return boundInstance;
  },
};

export { trapNewInstances };
