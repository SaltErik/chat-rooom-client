import { interceptNewInstances } from "./handlers/interceptNewInstances";

/** Ensures that static methods can be safely passed (and invoked) as event handlers. */
const autoBindClass = (targetClass: any) => {
  const descriptors = Object.getOwnPropertyDescriptors(targetClass);

  for (let descriptor in descriptors) {
    if (typeof targetClass[descriptor] === "function") {
      targetClass[descriptor] = targetClass[descriptor].bind(targetClass);
    }
  }
  return targetClass;
};

const classDecorator = (targetClass: any) => {
  const boundClass = autoBindClass(targetClass);
  const proxiedClass = new Proxy(boundClass, interceptNewInstances);
  return proxiedClass;
};

export { classDecorator as AutoBind };
