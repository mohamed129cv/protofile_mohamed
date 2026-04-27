import { CanDeactivateFn } from '@angular/router';

export const informtionGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
