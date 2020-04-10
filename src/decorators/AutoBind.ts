import { isFunction } from "util";
import { trapNewInstances } from "./handlers/trapNewInstances";

/** Ensures that static methods can be safely passed (and invoked) as event handlers. */
const autoBindClass = (targetClass: any) => {
  const descriptors = Object.getOwnPropertyDescriptors(targetClass);

  for (let descriptor in descriptors) {
    if (isFunction(targetClass[descriptor])) {
      targetClass[descriptor] = targetClass[descriptor].bind(targetClass);
    }
  }
  return targetClass;
};

const classDecorator = (targetClass: any) => {
  const boundClass = autoBindClass(targetClass);
  const proxiedClass = new Proxy(boundClass, trapNewInstances);
  return proxiedClass;
};

export { classDecorator as AutoBind };
