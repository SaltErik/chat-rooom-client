import { count } from "../../utils/console";

const autoBindInstance = (instance: any) => {
  const classPrototype = instance.constructor.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(classPrototype);

  for (let descriptor in descriptors) {
    if (descriptor !== "constructor") {
      instance[descriptor] = classPrototype[descriptor].bind(instance);
    }
  }
  return instance;
};

const interceptNewInstances = {
  construct(original: any, argumentsList: any[], _proxied: any) {
    count(`${original.name}: constructor`);
    const that = new original(...argumentsList);
    const boundThat = autoBindInstance(that);
    return boundThat;
  },
};

export { interceptNewInstances };
