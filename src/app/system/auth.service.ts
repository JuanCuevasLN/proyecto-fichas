//Angular
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationResult } from '@angular/fire/auth';

//RXJS
import { BehaviorSubject, catchError, map, of } from 'rxjs';

//App
import { environments } from '../environments/environments';
import { SnackBarService } from '../shared/snack-bar.service';
import { Usuario } from '../models/user.interface';
import { AdminData } from '../models/admin.interface';
import { LoginFormEmail } from '../models/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //API
  private login = environments.sistemaDeVentasBackendApi + '/auth'
  private create = environments.sistemaDeVentasBackendApi + '/admin'
  private VerifyAuth = environments.sistemaDeVentasBackendApi + '/verifyAuth'

  //Service
  public router = inject(Router)
  private http = inject(HttpClient)
  public _snackBar = inject(SnackBarService)
  public confirmationResult!: ConfirmationResult;
  
  public connectedUser$ = new BehaviorSubject<Usuario | null | undefined>(undefined)

  constructor() {
    this.http.get<Usuario>(this.VerifyAuth, { withCredentials: true }).pipe(
      map(user => {
        this.connectedUser$.next(user);
      }),
      catchError(error => {
        this.connectedUser$.next(null);
        return of(null); 
      })
    ).subscribe(); 
  }

  //Crear Administrador
  createAdmin(data: AdminData) {
    return this.http.post(this.create, data)
  }

  //Iniciar sesion
  singInWhithEmailAndPasswordAndExpress(data: LoginFormEmail) {
    return this.http.post(this.login, data, {
      withCredentials: true
    })
  }
}
