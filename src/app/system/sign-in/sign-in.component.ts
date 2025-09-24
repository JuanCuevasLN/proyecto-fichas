//Angular
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

//Angular Material
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

// Firebase
import { Auth } from '@angular/fire/auth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// App
import { AuthService } from '../auth.service';
import { VerificationCodeComponent } from './verification-code/verification-code.component';

@Component({
  selector: 'app-sing-in',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})

export class SignInComponent {
  private auth = inject(Auth);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  constructor() {
    const isConnect = this.authService.connectedUser$.value;
    if (isConnect) {
      this.authService._snackBar.openSnarkBar('Ya tienes una cuenta iniciada', 'ok');
      this.authService.router.navigate(['']);
    }
  }

  userCode = ''; // Código que el usuario va a ingresar
  showCode = false;
  showCodeInput = false;
  showCountryCode = false;
  recaptchaVerifier!: RecaptchaVerifier; // ← importante declarar esta propiedad

  LoginForm = this.fb.group({
    countryCode: ['+52'],
    password: ['', [Validators.required]],
    phoneOrEmail: ['', [Validators.required]],
  });

  ngOnInit() {
    this.LoginForm.get('phoneOrEmail')?.valueChanges.subscribe(value => {
      const containsAt = value?.includes('@');
      const containLetter = /[a-zA-Z]/.test(value!);
      const passwordControl = this.LoginForm.get('password');

      if (containsAt || containLetter || value === '') {
        passwordControl?.enable();
        this.showCountryCode = false;
      } else {
        passwordControl?.disable();
        this.showCountryCode = true;
      }
    });
  }

  loginData() {
    if (this.LoginForm.invalid) {
      return this.authService._snackBar.openSnarkBar('Formulario inválido');
    }

    let { phoneOrEmail, password, countryCode } = this.LoginForm.value;
    password = password?.trim();
    countryCode = countryCode?.trim();
    phoneOrEmail = phoneOrEmail?.trim();

    if (!phoneOrEmail) {
      return this.authService._snackBar.openSnarkBar('Debes ingresar correo o teléfono');
    }

    const isEmail = phoneOrEmail.includes('@');
    if (isEmail) {   
      if (!password) {
        return this.authService._snackBar.openSnarkBar('Favor de rellenar el campo de la contraseña');
      }

      const login = {
        email: phoneOrEmail,
        password
      }

      this.authService.singInWhithEmailAndPasswordAndExpress(login).subscribe({
        next: (respuesta: any) => {
          console.log(respuesta)
          this.authService._snackBar.openSnarkBar(`Bienvenid@ ${respuesta?.user?.name}.`, 'Gracias')
          this.authService.connectedUser$.next(respuesta.user)
          this.authService.router.navigate([''])
        }, 
        error: (err) => {
          this.authService._snackBar.openSnarkBar('Error al inicar session: ' + err?.error.message, 'ok')
        }
      })
    } else {
      this.showCode = true;
      const phone = `${countryCode}${phoneOrEmail}`;

      // Solo crear el reCAPTCHA si aún no existe
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
      }
      this.recaptchaVerifier = new RecaptchaVerifier(
         this.auth, 
        'recaptcha-container', 
        {
          size: 'invisible',
          callback: (response: any) => {
            console.log('reCAPTCHA resuelto automáticamente');
            // aquí puedes continuar el flujo si quieres
          },
          'expired-callback': () => {
            this.authService._snackBar.openSnarkBar('El reCAPTCHA ha expirado. Intenta de nuevo.');
          }
        }, 
      );
      
      return signInWithPhoneNumber(this.auth, phone, this.recaptchaVerifier)
        .then((confirmationResult) => {
          this.authService.confirmationResult = confirmationResult;
          this.authService._snackBar.openSnarkBar('Código enviado al numero: ' + phone, 'ok');
          // Mostrar interfaz para ingresar código si deseas
          this.dialog.open(VerificationCodeComponent, {
            width: '600px',
            disableClose: true,
          })
        })
        .catch((error) => {
          console.error(error);
          this.authService._snackBar.openSnarkBar('Error al enviar SMS: ' + error.message);
          // Mostrar interfaz para ingresar código si deseas
          this.dialog.open(VerificationCodeComponent, {
            width: '600px',
            disableClose: true,
            panelClass: 'custom-dialog-container',
          })
        });
    }
  }

   // Método para verificar el código que el usuario ingresa
  verifyCode() {
    const { userCode } = this;
    if (!userCode) {
      return this.authService._snackBar.openSnarkBar('Por favor ingresa el código de verificación');
    }

    this.authService.confirmationResult
      .confirm(userCode)
      .then((result) => {
        this.authService._snackBar.openSnarkBar('Inicio de sesión exitoso');
        // Redirigir o hacer algo más después de un inicio de sesión exitoso
      })
      .catch((error) => {
        console.error(error);
        this.authService._snackBar.openSnarkBar('Código incorrecto');
      });
  }
}
