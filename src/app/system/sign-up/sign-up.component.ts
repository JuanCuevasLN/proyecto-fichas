import { MatSelectModule } from '@angular/material/select';
//common
import { CommonModule } from '@angular/common';
//core
import { Component, inject } from '@angular/core';
//material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
//forms
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminData } from '../../models/admin.interface';
import { ImageFormControlComponent } from "../../shared/image-form-control/image-form-control.component";
import { SnackBarService } from '../../shared/snack-bar.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    ImageFormControlComponent
  ],
  providers: [
    AuthService
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})

export class SignUpComponent {
  private router = inject(Router)
  private readonly fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private readonly _snackBar = inject(SnackBarService)

  //Formulario
  registerForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    countryCode: ['+52'],
    phone: [, [Validators.minLength(10)]],
    password: ['', [Validators.required, this.validatorsPassword()]],
    imagen:[null, [Validators.required]]
  }, {Validators: [this.emailOrPhone()]});

  emailOrPhone (): ValidatorFn {
    return (group: AbstractControl): {[key: string]: any} | any => {
      const email = group.get('email')?.value
      const phone = group.get('phone')?.value
      const countryCode = group.get('countryCode')?.value

      const emailValid = group.get('email')?.valid
      const phoneValid = group.get('phone')?.valid

      if (!email && !phone) return { requerid: true }
      if (phone && ! countryCode) return { requerid: true }

      if (email && !emailValid) return { emailInvalid: true }
      if (phone && !phoneValid) return { phoneInvalid: true }

      return null
    }
  }
 
  validatorsPassword(): ValidatorFn  {
    return (control: AbstractControl): {[key: string]: any} | any => {
      const pass = control.value
      const regex = /[A-Z0-9]/
      if ((pass.length >= 8 && regex.test(pass)) || pass.length >= 15) return null
      return {passwordInvalid: true}
    }
  }

  //Getter de errores
  get nameError() {
    const nameControl = this.registerForm.get('displayName')
    if (nameControl?.hasError('required')) return 'El nombre es obligatorio';    
    if (nameControl?.hasError('minlength')) return 'El nombre debe tener mínimo 3 letras';

    return null;
  }
  
  get passError() {
    const passControl = this.registerForm.get('password')
    if (passControl?.hasError('required')) return 'La contraseña es obligatorio';
    if (passControl?.hasError('passwordInvalid')) return 'La contraseña debe ser más larga o tener numeros';

    return null;
  }

  saveData() {
    const isValid = this.registerForm.status
    if (isValid == 'INVALID') {
      this._snackBar.openSnarkBar("Formulario Invalido")
      return 
    } 
    const code = this.registerForm.get('countryCode')?.value
    
    const { displayName, email, phone, password, imagen } = this.registerForm.value
    
    const adminData = {
      displayName,
      password,
      email,
      code,
      phone,
    } as AdminData
    
    if (!displayName || !password || (!email && !phone) || !imagen){
      this._snackBar.openSnarkBar("Hay campos vacios")
      return 
    }
    if (phone && !code) return this._snackBar.openSnarkBar('Seleccione un codigo de pais')

    if (phone) adminData.phone = code + phone

    console.log(adminData)
    
    this.authService.createAdmin(adminData).subscribe({
      next: () => {
        this._snackBar.openSnarkBar("Usuario creado con éxito"),
        this.router.navigateByUrl('/sign-in')
      },
      error: (err) => this._snackBar.openSnarkBar("Error al crear usuario: " + err?.error?.message)
    })
  }
}