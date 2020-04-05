import { isConstructorMethod } from "../predicates/decorators/class/constructor";
import { Constructor } from "../typings/declarations";
import { count } from "../utils/console";

const countCalls: ProxyHandler<Function> = {
  apply(target: Function, thisArg: Object, argumentsList: unknown[]) {
    count(`${thisArg.constructor.name}: ${target.name}`);
    return target.apply(thisArg, argumentsList);
  },
};

const countConstructorCalls: ProxyHandler<Constructor> = {
  construct(target: Constructor, argumentsList: unknown[], _newTarget: Object) {
    count(`${target.name}: constructor`);
    return new target(...argumentsList);
  },
};

////////////////////////////////////////////////////////////////////////////////////////

const prototypeDecorator = (targetClass: any) => {
  const descriptors = Object.getOwnPropertyDescriptors(targetClass.prototype);

  let decoratedConstructor: Constructor | void;
  for (let descriptor in descriptors) {
    const method: Function = targetClass.prototype[descriptor];

    if (isConstructorMethod(method, targetClass)) {
      /** This means we've identified the constructor (which requires a custom trap handler). */
      decoratedConstructor = new Proxy(method, countConstructorCalls);
    } else {
      /** Regular method, regular trap handler. */
      targetClass.prototype[descriptor] = new Proxy(method, countCalls);
    }
  }

  if (decoratedConstructor) {
    return decoratedConstructor;
  }
  return targetClass;
};

////////////////////////////////////////////////////////////////////////////////////////

export { prototypeDecorator as CountCalls };
