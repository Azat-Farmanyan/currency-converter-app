import {
  HttpErrorResponse,
  type HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: any) => {
      alert(err?.error?.message);
      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};
