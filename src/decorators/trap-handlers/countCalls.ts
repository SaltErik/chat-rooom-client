import { count } from "../../utils/console";

const countCalls: ProxyHandler<Function> = {
  apply(target: Function, thisArg: Object, argumentsList: unknown[]) {
    count(`${thisArg.constructor.name}: ${target.name}`);
    return target.apply(thisArg, argumentsList);
  },
};

export { countCalls };
