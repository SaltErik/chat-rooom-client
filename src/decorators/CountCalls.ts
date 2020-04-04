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
  construct(target: Constructor, argumentsList: any[], _newTarget: FunctionConstructor) {
    count(`${target.name}: constructor`);
    return new target(...argumentsList);
  },
};

const constructorDecorator = <T extends Constructor>(constructor: T): InstanceType<ProxyConstructor> => {
  return new Proxy(constructor, constructorCallHandler);
};

////////////////////////////////////////////////////////////////////////////////////////

const clientAPI = <T>(...args: any[]): Constructor<T> | PropertyDescriptor => {
  switch (args.length) {
    case 1:
      return constructorDecorator<Constructor<T>>(args[0]);
    case 3:
      return methodDecorator<T, keyof T>(args[0], args[1], args[2]);
    default:
      throw new RangeError(`Expected 1 or 3 arguments, recieved ${args.length}!`);
  }
};

export { clientAPI as CountCalls };
