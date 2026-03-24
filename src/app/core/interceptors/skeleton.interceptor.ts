import { HttpInterceptorFn } from '@angular/common/http';

export const skeletonInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
