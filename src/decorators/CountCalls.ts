import { Constructor } from "../typings/declarations";
import { count } from "../utils/console";

const methodCallHandler = {
  apply(target: Function, thisArg: Object, argumentsList: any[]) {
    count(`${thisArg.constructor.name}: ${target.name}`);
    return target.apply(thisArg, argumentsList);
  },
};

const methodDecorator = <T, K extends keyof T>(_target: T, _key: K, descriptor: PropertyDescriptor): PropertyDescriptor => {
  descriptor.value = new Proxy<PropertyDescriptor["value"]>(descriptor.value, methodCallHandler);
  return descriptor;
};

////////////////////////////////////////////////////////////////////////////////////////

const constructorCallHandler = {
  construct(target: Constructor, argumentsList: any[], _newTarget: Object) {
    count(`${target.name}: constructor`);
    return new target(...argumentsList);
  },
};

const constructorDecorator = (constructor: Constructor) => {
  return new Proxy(constructor, constructorCallHandler);
};

////////////////////////////////////////////////////////////////////////////////////////

const clientAPI = (...args: any[]): any | never => {
  switch (args.length) {
    case 1:
      return constructorDecorator(args[0]);
    case 3:
      return methodDecorator(args[0], args[1], args[2]);
    default:
      throw new RangeError(`Expected 1 or 3 arguments, recieved ${args.length}!`);
  }
};

export { clientAPI as CountCalls };
