import { isConstructorMethod } from "../predicates/classes/isConstructorMethod";
import { Constructor } from "../typings/declarations";
import { countCalls } from "./handlers/countCalls";
import { countConstructorCalls } from "./handlers/countConstructorCalls";

const prototypeDecorator = (targetClass: any) => {
  const classPrototype = targetClass.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(classPrototype);

  let decoratedConstructor: Constructor | void;
  for (let descriptor in descriptors) {
    const method: Function = classPrototype[descriptor];

    if (isConstructorMethod(method, targetClass)) {
      /** This means we've identified the constructor (which requires a custom trap handler). */
      decoratedConstructor = new Proxy(method, countConstructorCalls);
    } else {
      /** Regular method, regular trap handler. */
      classPrototype[descriptor] = new Proxy(method, countCalls);
    }
  }

  if (decoratedConstructor) {
    return decoratedConstructor;
  }
  return targetClass;
};

export { prototypeDecorator as CountCalls };
