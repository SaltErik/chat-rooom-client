import { trapCalls } from "./handlers/trapCalls";

const prototypeDecorator = (targetClass: any) => {
  const classPrototype = targetClass.prototype;
  const descriptors = Object.getOwnPropertyDescriptors(classPrototype);

  for (let descriptor in descriptors) {
    classPrototype[descriptor] = new Proxy(classPrototype[descriptor], trapCalls);
  }

  const decoratedClass = new Proxy(targetClass, trapCalls);
  return decoratedClass;
};

export { prototypeDecorator as CountCalls };
