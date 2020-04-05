import { Constructor } from "../typings/declarations";
import { count } from "../utils/console";

const countCalls = {
  apply(target: Function, thisArg: Object, argumentsList: any[]) {
    count(`${thisArg.constructor.name}: ${target.name}`);
    return target.apply(thisArg, argumentsList);
  },
};

const countConstructorCalls = {
  construct(target: Constructor, argumentsList: any[], _newTarget: Object) {
    count(`${target.name}: constructor`);
    return new target(...argumentsList);
  },
};

////////////////////////////////////////////////////////////////////////////////////////

const prototypeDecorator = (decoratedClass: any) => {
  const descriptors = Object.getOwnPropertyDescriptors(decoratedClass.prototype);

  let replacementConstructor;
  for (let descriptor in descriptors) {
    const firstPrototype = Object.getPrototypeOf(decoratedClass.prototype[descriptor]);
    const secondPrototype = Object.getPrototypeOf(decoratedClass);

    if (Object.is(firstPrototype, secondPrototype)) {
      /** This means we've identified the constructor (which requires a custom trap handler). */
      replacementConstructor = new Proxy(decoratedClass.prototype[descriptor], countConstructorCalls);
    } else {
      /** Regular method, regular trap handler. */
      decoratedClass.prototype[descriptor] = new Proxy(decoratedClass.prototype[descriptor], countCalls);
    }
  }

  if (replacementConstructor) {
    return replacementConstructor;
  }
  return decoratedClass;
};

////////////////////////////////////////////////////////////////////////////////////////

export { prototypeDecorator as CountCalls };
