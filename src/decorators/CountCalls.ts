import { isConstructorMethod } from "../predicates/classes/isConstructorMethod";
import { countCalls } from "./handlers/countCalls";

const prototypeDecorator = (targetClass: any) => {
  const classPrototype = targetClass.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(classPrototype);

  for (let descriptor in descriptors) {
    const method: Function = classPrototype[descriptor];

    if (!isConstructorMethod(method, targetClass)) {
      classPrototype[descriptor] = new Proxy(method, countCalls);
    }
  }
  return targetClass;
};

export { prototypeDecorator as CountCalls };
