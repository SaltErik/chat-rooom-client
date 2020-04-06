import { Constructor } from "../../typings/declarations";
import { count } from "../../utils/console";

const countConstructorCalls: ProxyHandler<Constructor> = {
  construct(target: Constructor, argumentsList: unknown[], _newTarget: Object) {
    count(`${target.name}: constructor`);
    return new target(...argumentsList);
  },
};

export { countConstructorCalls };
