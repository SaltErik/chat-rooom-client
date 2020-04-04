import { count } from "../utils/console";

const handler = {
  apply(target: Function, thisArg: Object, argumentsList: any[]) {
    count(`${thisArg.constructor.name}: ${target.name}`);
    return target.apply(thisArg, argumentsList);
  },
};

const CountCalls = (_target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): PropertyDescriptor => {
  descriptor.value = new Proxy<PropertyDescriptor["value"]>(descriptor.value, handler);
  return descriptor;
};

export { CountCalls };
