import { count } from "../utils/console";

const callHandler = {
  apply(target: Function, thisArg: Object, argumentsList: ArrayLike<IArguments>) {
    count(`${thisArg.constructor.name}: ${target.name}`);
    return target.apply(thisArg, argumentsList);
  },
};

const methodDecorator = (_target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor => {
  descriptor.value = new Proxy<PropertyDescriptor["value"]>(descriptor.value, callHandler);
  return descriptor;
};

export { methodDecorator as CountCalls };
