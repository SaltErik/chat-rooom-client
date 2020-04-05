import { Constructor } from "../../../typings/declarations";

const isConstructorMethod = (method: Function, targetClass: Constructor): method is Constructor => {
  const methodPrototype = Object.getPrototypeOf(method);
  const classPrototype = Object.getPrototypeOf(targetClass);
  return Object.is(methodPrototype, classPrototype);
};

export { isConstructorMethod };
