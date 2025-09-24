import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/user.interface';
import { CanActivateFn, Router } from '@angular/router';
import { environments } from '../environments/environments';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const VerifyAuth = environments.sistemaDeVentasBackendApi + '/verifyAuth'

  return http.get<Usuario>(VerifyAuth, { withCredentials: true }).pipe(
    map(user => {
      if (user) return true;  
      router.navigate(['/sign-in']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/sign-in']);
      return of(false);
    })
  );
};
